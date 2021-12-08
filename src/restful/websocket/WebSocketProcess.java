package restful.websocket;

import javax.servlet.http.HttpSession;
import javax.websocket.CloseReason;
import javax.websocket.Endpoint;
import javax.websocket.EndpointConfig;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import restful.bean.Talk;
import restful.bean.Result.ResultCode;
import restful.utils.ChatTools;
import restful.utils.InterfaceTools;
import restful.utils.Logging;


@ServerEndpoint(value="/ws/action", configurator = GetHttpSessionConfigurator.class)
public class WebSocketProcess extends Endpoint {
	private final static Logger LOGGER = LoggerFactory.getLogger(WebSocketProcess.class);
	private final static InterfaceTools tools = new InterfaceTools();
	private Session session;
	private String chatUser;
	
	
	// 增加用户session
	@Override
	public void onOpen(Session session, EndpointConfig endpointConfig) {
		System.out.println(session);
		HttpSession httpSession = (HttpSession) endpointConfig.getUserProperties().get(HttpSession.class.getName());
		String chatUser = (String) httpSession.getAttribute("chatUser");
		System.out.println(httpSession);
		this.session = session;
		this.chatUser = chatUser;		
		ChatTools.getClients().put(chatUser, this);
		LOGGER.info("用户 " + chatUser+ "成功建立连接");
		for (String key : ChatTools.getClients().keySet()) {
			System.out.println("webSocket client:"+key);
		}
	}

	// 移除用户session
	@Override
	public void onClose(Session session, CloseReason closeReason) {
		ChatTools.getClients().remove(this.chatUser);
		for (String key : ChatTools.getClients().keySet()) {
			System.out.println("webSocket client:"+key);
		}
	}

	@Override
	public void onError(Session session, Throwable error) {
		error.printStackTrace();
	}	

	/* 向全部用户发消息 */
	public static String sendMessageToUsers(Talk message) {
//		WebSocketProcess client = null;
//		Result result = new Result();
//		int errorCount = 0;
//		for (String target : ChatTools.getClients().keySet()) {
//			client = ChatTools.getClients().get(target);
//			try {
//				if (client.session.isOpen()) {
//					sendMessageToUser(target, message);
//				}
//			} catch (Exception e) {
//				e.printStackTrace();
//				errorCount++;
//				LOGGER.info("批量消息发送：向用户 " + message.getTo()+ " 发送消息失败");
//			}
//		}
//		if (errorCount == 0) {
//			result.setCode(1);
//			result.setDescription("全部用户消息发送成功");
//		} else {
//			result.setCode(-1);
//			result.setDescription("全部用户消息发送过程中，" + errorCount + " 个消息发送失败");
//		}
//		return result;
		return "3";
	}

	/* 向单一用户发消息 */ 
	public static String sendMessageToUser(String target, String message) {	
//		if(target.toUpperCase().equals("ALL")) {
//			return sendMessageToUsers(message);			
//		}
		System.out.println(target +"尝试发送"+message);
		WebSocketProcess client = ChatTools.getClients().get(target);
//		Result result = new Result();
//		result.setCode(1);
//		result.setDescription("单一用户消息发送成功");
		if(client==null) {
			return tools.makeErReturn(ResultCode.USER_LOGINOUT_WS);
		}
		try {
			if (client.session.isOpen()) {
				sendMessage( client.session, message);
			}
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.info("发送消息失败");
			WebSocketProcess a = new WebSocketProcess();
			Logging.Log(a.getClass().getName(), "发送失败"+message,target);
			return tools.makeErReturn(ResultCode.USER_LOGINOUT_WS);
		}
		return tools.makeReturn(message);
	}
	
	
	private static void sendMessage(Session session, String message) {
		session.getAsyncRemote().sendText(message);
	}
}