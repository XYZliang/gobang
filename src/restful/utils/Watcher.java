package restful.utils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

public class Watcher {
	private static Map<String, String> clients = new ConcurrentHashMap<String, String>();

	@Resource
	private final static InterfaceTools tools = new InterfaceTools();

	public static String setCurUser(HttpSession session, String chatUser) {
		session.setAttribute("chatUser", chatUser);
		return tools.makeReturn();
	}

	public static synchronized Map<String, String> getClients() {
		return clients;
	}
//
//	@Context
//	private static HttpSession session; // 具有一个session参数
//
//	public static HttpSession getSession() {
//		return session;
//	}
//
//	public static void setSession(HttpSession session) {
//		Watcher.session = session;
//	}
}
