package restful.listener;


import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.http.HttpServletRequest;
 
public class RequestListener implements ServletRequestListener {
 
	@Override
	public void requestDestroyed(ServletRequestEvent sre) {
 
	}
 
	public RequestListener() {
 
	}
 
	@Override
	public void requestInitialized(ServletRequestEvent sre) {
		// 将所有request请求都携带上httpSession
		((HttpServletRequest) sre.getServletRequest()).getSession();
	}
 
}
