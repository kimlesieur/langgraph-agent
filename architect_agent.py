import os
import asyncio
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

# Load variables from .env file
load_dotenv()

async def main():
    # --- CONFIGURATION ---
    # Use a real path on your Mac. '.' refers to the current directory.
    PROJECT_PATH = os.path.abspath("./react-native-parallax") 
    
    if not os.path.exists(PROJECT_PATH):
        print(f"❌ Error: Path {PROJECT_PATH} does not exist.")
        return

    source_dir = "src" if os.path.isdir(os.path.join(PROJECT_PATH, "src")) else "app"
    source_dir_path = os.path.join(PROJECT_PATH, source_dir)

    print(f"📂 Indexing project at: {PROJECT_PATH}")

    # --- MCP CONFIGURATION (Fixed for v0.1.0+) ---
    # Each server entry MUST have a "transport" key.
    client = MultiServerMCPClient({
        "local_files": {
            "transport": "stdio",  # <--- THIS WAS MISSING
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", PROJECT_PATH]
        }
    })
    
    try:
        print("🔗 Connecting to MCP Filesystem Server...")
        mcp_tools = await client.get_tools()
        print(f"✅ Tools loaded: {[t.name for t in mcp_tools]}")

        model = ChatOpenAI(model="gpt-4o", temperature=0)

        system_msg = (
            "You are a Senior React Native Architect. "
            "Explore the codebase using your tools to understand the architecture. "
            f"You can only access files under this MCP root directory: {PROJECT_PATH}. "
            "Always use full paths under that root when calling tools. "
            "Always output a structured plan in a file named FEATURE_PLAN.md."
        )

        # Create the Graph
        agent = create_react_agent(model, mcp_tools, prompt=system_msg)

        # User Request
        query = (
            f"Read '{PROJECT_PATH}/package.json' to see dependencies, then list files in "
            f"'{source_dir_path}'."
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
                    
    finally:
        # In a real app, you'd close the client here
        pass

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Architect agent stopped.")