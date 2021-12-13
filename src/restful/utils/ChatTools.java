package restful.utils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import restful.websocket.WebSocketProcess;

public class ChatTools {
	private static Map<String, WebSocketProcess> clients = new ConcurrentHashMap<String, WebSocketProcess>();

	@Resource
	private final static InterfaceTools tools = new InterfaceTools();

	public static String setCurUser(HttpSession session, String chatUser) {
		session.setAttribute("chatUser", chatUser);
		return tools.makeReturn();
	}

	public static synchronized Map<String, WebSocketProcess> getClients() {
		return clients;
	}

	@Context
	private static HttpSession session; // 具有一个session参数

	public static HttpSession getSession() {
		return session;
	}

	public static void setSession(HttpSession session) {
		ChatTools.session = session;
	}
}