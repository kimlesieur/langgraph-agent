import os
import asyncio
import argparse
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent

# Load variables from .env file
load_dotenv()

async def main(feature_description: str, project_path: str):
    # --- CONFIGURATION ---
    if not os.path.exists(project_path):
        print(f"❌ Error: Path {project_path} does not exist.")
        return

    source_dir = "src" if os.path.isdir(os.path.join(project_path, "src")) else "app"
    source_dir_path = os.path.join(project_path, source_dir)

    print(f"📂 Indexing project at: {project_path}")

    # --- MCP CONFIGURATION ---
    # Each server entry MUST have a "transport" key.
    client = MultiServerMCPClient({
        "local_files": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", project_path]
        }
    })

    last_assistant_text = ""

    try:
        print("🔗 Connecting to MCP Filesystem Server...")
        mcp_tools = await client.get_tools()
        print(f"✅ Tools loaded: {[t.name for t in mcp_tools]}")

        model = ChatOpenAI(model="gpt-4o", temperature=0)

        rn_examples_path = os.path.join(project_path, "rn-code-examples")
        has_rn_examples = os.path.isdir(rn_examples_path)
        plan_path = os.path.join(project_path, "FEATURE_PLAN.md")

        tasks = [
            f"Explore the project structure: read package.json, list the source directory "
            f"({source_dir_path}), and inspect key screens, components, navigation, state, "
            "and API patterns.",
            "Produce a structured implementation plan for the requested feature, aligned "
            "with the existing codebase patterns.",
            "Include code examples (snippets) consistent with the codebase.",
            f"Write the final plan to {plan_path} using your write_file tool.",
        ]
        if has_rn_examples:
            tasks.insert(
                1,
                f"Use the rn-code-examples folder at {rn_examples_path} as a reference for "
                "patterns and snippets; prefer reusing or adapting examples from there and "
                "cite each in the **Snippet sources** section as \"rn-code-examples/<path>\".",
            )
        tasks_text = "\n".join(f"{i+1}. {t}" for i, t in enumerate(tasks))

        system_msg = (
            "You are a Senior React Native Architect.\n"
            f"You can only access files under this MCP root directory: {project_path}. "
            "Always use full absolute paths when calling tools.\n"
            "Expo Router uses route groups with parentheses (e.g. (tabs)); use the exact path "
            "as returned by list_directory (e.g. app/(tabs), not app/tabs).\n"
            "Only list or read paths that exist; do not assume optional folders (e.g. rn-code-examples) exist.\n\n"
            "Your tasks:\n"
            f"{tasks_text}\n\n"
            "The FEATURE_PLAN.md must follow this structure:\n"
            "- **Overview**: brief description of the feature and its purpose.\n"
            "- **Implementation Steps**: numbered, ordered list of steps.\n"
            "- **Files to Create/Modify**: list each file with a short description.\n"
            "- **Code Examples**: relevant snippets in markdown code blocks. For each snippet, "
            "add a short line above or below the block indicating its origin (see below).\n"
            "- **Snippet sources**: a dedicated section listing the origin of every code snippet "
            "used in the plan. For each snippet, give either:\n"
            "  - \"rn-code-examples/<path>\": when the snippet is taken or adapted from the "
            "rn-code-examples folder (e.g. rn-code-examples/theme/useColorScheme.ts);\n"
            "  - \"<project path>\": when from the project itself (e.g. app/(tabs)/_layout.tsx).\n"
            "This section ensures traceability and confirms when reference examples are used.\n"
            "- **Notes / Dependencies**: any libraries to install, caveats, or follow-ups."
        )

        # Create the Graph
        agent = create_agent(model, mcp_tools, system_prompt=system_msg)

        # User Request
        query = (
            f"Analyze this React Native project and create an implementation plan with code "
            f"examples for: {feature_description}. "
            f"Write the final plan to {plan_path} in the project root using your write tool. "
            "Include the **Snippet sources** section listing the origin of every snippet "
            "(rn-code-examples/<path> or project path)."
        )

        print("🚀 Architect is analyzing your local files...\n")

        inputs = {"messages": [("user", query)]}

        async for chunk in agent.astream(inputs, stream_mode="values"):
            message = chunk["messages"][-1]
            content = getattr(message, "content", None)

            # Newer message payloads can be structured (list/dict), not just plain text.
            if isinstance(content, str):
                text = content.strip()
            elif isinstance(content, list):
                parts = []
                for item in content:
                    if isinstance(item, str):
                        parts.append(item)
                    elif isinstance(item, dict) and item.get("type") == "text":
                        parts.append(str(item.get("text", "")))
                text = "\n".join(p for p in parts if p).strip()
            elif content is None:
                text = ""
            else:
                text = str(content).strip()

            if text:
                print(f"\n[Architect]: {text}")
                # Track the last non-empty AI message for the fallback write
                if message.__class__.__name__ == "AIMessage":
                    last_assistant_text = text

        # --- FALLBACK: write FEATURE_PLAN.md if the agent skipped the write tool ---
        if not os.path.exists(plan_path) and last_assistant_text:
            print(f"\n📝 Agent did not write the file; saving last response to {plan_path}")
            with open(plan_path, "w", encoding="utf-8") as f:
                f.write(last_assistant_text)
            print(f"✅ FEATURE_PLAN.md written to {plan_path}")

    finally:
        # Tear down MCP server connections and subprocesses.
        # MultiServerMCPClient supports the async context manager protocol;
        # if used outside of `async with`, call aclose() when available.
        if hasattr(client, "aclose"):
            await client.aclose()
        # else: no explicit close API in this version; resources are released
        # when the event loop exits.


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Architect Agent: generate a React Native feature implementation plan."
    )
    parser.add_argument(
        "feature",
        help="Description of the feature to implement (e.g. 'dark mode toggle').",
    )
    parser.add_argument(
        "--project",
        default="project-example",
        help="Path to the React Native project (default: project-example).",
    )
    args = parser.parse_args()

    feature_description = args.feature
    project_path = os.path.abspath(args.project)

    try:
        asyncio.run(main(feature_description, project_path))
    except KeyboardInterrupt:
        print("\n👋 Architect agent stopped.")
