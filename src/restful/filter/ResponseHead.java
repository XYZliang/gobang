package restful.filter;

import java.io.IOException;

import javax.ws.rs.WebApplicationException;

import org.jboss.resteasy.spi.interception.MessageBodyWriterContext;
import org.jboss.resteasy.spi.interception.MessageBodyWriterInterceptor;

//@SuppressWarnings("deprecation")  
//
//public class ResponseHead implements PostProcessInterceptor {
//
//    @Override  
//
//    public void postProcess(ServerResponse serverResponse) {  
//
//        System.out.printf("postProcess\t entity:%s\n\n",  
//
//                serverResponse.getEntity().toString());       
//
//    }     
//
//}  

@SuppressWarnings("deprecation")
public class ResponseHead implements MessageBodyWriterInterceptor {

	private void addHead(MessageBodyWriterContext context, String arg1, String arg2) {
		context.getHeaders().add(arg1, arg2);
	}

	public void write(MessageBodyWriterContext context) throws WebApplicationException, IOException {
		// 基础设置
		addHead(context, "X-Powered-By", "jxufe");

		// 跨域设置
		addHead(context, "Access-Control-Allow-Origin", "*");
		addHead(context, "Access-Control-Allow-Credentials", "true");
		addHead(context, "Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, PUT");
		addHead(context, "Access-Control-Max-Age", "3600");

		// 禁止对api进行缓存
		// 禁止客户端对该次响应的内容复制至缓存区域
		addHead(context, "Cache-Control", "no-store");
		// 客户端下一次请求进行缓存有效度验证时，不使用该次的相应结果
		addHead(context, "Cache-Control", "no-cache");
		// 设置缓存有效期是0，客户端下一次请求不使用缓存
		addHead(context, "Cache-Control", "max-age=0");
		// 客户端下一次请求时，必须对缓存有效性进行重新验证再使用
		addHead(context, "Cache-Control", "must-revalidate");
		context.proceed();
	}
}

//public class ResponseHead implements Filter {
//
//	@Override
//	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//			throws IOException, ServletException {
//		// TODO 自动生成的方法存根
//		
//	}
//	@Override
//	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//			throws IOException, ServletException {
//		HttpServletResponse req = (HttpServletResponse) response;
//		HttpServletResponseWrapper requestWrapper = new HttpServletResponseWrapper(req);
//		if (req.getHeader("Sec-WebSocket-Extensions") != null) {
//			requestWrapper.addHeader("Sec-WebSocket-Extensions", "permessage-deflate");
//		}
//		
//		// 基础设置
//		requestWrapper.addHeader( "X-Powered-By", "jxufe");
//
//				// 跨域设置
//		requestWrapper.addHeader( "Access-Control-Allow-Origin", "*");
//		requestWrapper.addHeader( "Access-Control-Allow-Credentials", "true");
//		requestWrapper.addHeader( "Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, PUT");
//		requestWrapper.addHeader( "Access-Control-Max-Age", "3600");
//
//				// 禁止对api进行缓存
//				// 禁止客户端对该次响应的内容复制至缓存区域
//		requestWrapper.addHeader( "Cache-Control", "no-store");
//				// 客户端下一次请求进行缓存有效度验证时，不使用该次的相应结果
//		requestWrapper.addHeader( "Cache-Control", "no-cache");
//				// 设置缓存有效期是0，客户端下一次请求不使用缓存
//		requestWrapper.addHeader( "Cache-Control", "max-age=0");
//				// 客户端下一次请求时，必须对缓存有效性进行重新验证再使用
//		requestWrapper.addHeader("Cache-Control", "must-revalidate");
//		
//		chain.doFilter((ServletRequest) requestWrapper, response);
//	}
//	
//	private class HeaderRequestWrapper extends HttpServletRequestWrapper {
//
//		public HeaderRequestWrapper(HttpServletRequest request) {
//			super(request);
//		}
//
//		private Map<String, String> headerMap = new HashMap<>();
//
//		public void addHeader(String name, String value) {
//			this.headerMap.put(name, value);
//		}
//
//		@Override
//		public String getHeader(String name) {
//			String headerValue = super.getHeader(name);
//			if (this.headerMap.containsKey(name)) {
//				headerValue = this.headerMap.get(name);
//			}
//			return headerValue;
//		}
//
//		@Override
//		public Enumeration<String> getHeaderNames() {
//			List<String> names = Collections.list(super.getHeaderNames());
//			for (String name : this.headerMap.keySet()) {
//				names.add(name);
//			}
//			return Collections.enumeration(names);
//		}
//
//		@Override
//		public Enumeration<String> getHeaders(String name) {
//			List<String> values = Collections.list(super.getHeaders(name));
//			if (this.headerMap.containsKey(name)) {
//				values = Arrays.asList(this.headerMap.get(name));
//			}
//			return Collections.enumeration(values);
//		}
//
//	}
//}
