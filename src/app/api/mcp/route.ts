import { NextRequest, NextResponse } from "next/server";
import { NUTRITRACK_MCP_TOOLS, handleMCPToolCall } from "@/lib/mcp/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    mcpVersion: "1.0.0",
    serverName: "nutritrack-nutrition-mcp",
    transport: "HTTP/JSON-RPC",
    tools: NUTRITRACK_MCP_TOOLS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, arguments: args } = body;

    if (!tool || typeof tool !== "string") {
      return NextResponse.json(
        { error: "Invalid MCP request. Missing 'tool' name." },
        { status: 400 }
      );
    }

    const result = await handleMCPToolCall(tool, args || {});
    return NextResponse.json({
      success: true,
      tool,
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "MCP Execution Error" },
      { status: 500 }
    );
  }
}
