package restful.utils;

import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

public class CommonTools {
	@Context
	private static HttpSession session;

	public static HttpSession getSession() {
		return session;
	}

	public static void setSession(HttpSession session) {
		CommonTools.session = session;
	}
}
