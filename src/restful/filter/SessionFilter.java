package restful.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class SessionFilter implements Filter {
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HeaderRequestWrapper requestWrapper = new HeaderRequestWrapper(req);
		if (req.getHeader("Sec-WebSocket-Extensions") != null) {
			requestWrapper.addHeader("Sec-WebSocket-Extensions", "permessage-deflate");
		}
		System.out.println("" + req.getSession());
//		CommonTools.setSession(req.getSession());
		chain.doFilter(requestWrapper, response);
	}

	private class HeaderRequestWrapper extends HttpServletRequestWrapper {

		public HeaderRequestWrapper(HttpServletRequest request) {
			super(request);
		}

		private Map<String, String> headerMap = new HashMap<>();

		public void addHeader(String name, String value) {
			this.headerMap.put(name, value);
		}

		@Override
		public String getHeader(String name) {
			String headerValue = super.getHeader(name);
			if (this.headerMap.containsKey(name)) {
				headerValue = this.headerMap.get(name);
			}
			return headerValue;
		}

		@Override
		public Enumeration<String> getHeaderNames() {
			List<String> names = Collections.list(super.getHeaderNames());
			for (String name : this.headerMap.keySet()) {
				names.add(name);
			}
			return Collections.enumeration(names);
		}

		@Override
		public Enumeration<String> getHeaders(String name) {
			List<String> values = Collections.list(super.getHeaders(name));
			if (this.headerMap.containsKey(name)) {
				values = Arrays.asList(this.headerMap.get(name));
			}
			return Collections.enumeration(values);
		}

	}

	@Override
	public void destroy() {
		// TODO 自动生成的方法存根

	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO 自动生成的方法存根

	}
}
