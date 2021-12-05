package restful.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieTools {
	public static void addCookie(String key, String value, String path, int maxAge, HttpServletResponse response) {
		Cookie cookie = new Cookie(key, value);
		cookie.setPath(path);
		cookie.setMaxAge(maxAge);
		response.addCookie(cookie);
	}

	public static String getCookie(String key, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {// 遍历数组
			String name = cookie.getName();
			if (name.equals(key)) {
				return cookie.getValue();
			}
		}
		return "";
	}
}
