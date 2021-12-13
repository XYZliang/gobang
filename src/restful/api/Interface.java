package restful.api;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;

import dm.jdbc.filter.stat.json.JSONObject;
import restful.bean.Result.ResultCode;
import restful.bean.Token.Token;
import restful.database.EM;
import restful.entity.GameEntity;
import restful.entity.UserEntity;
import restful.utils.AsyncFun;
import restful.utils.ChatTools;
import restful.utils.CookieTools;
import restful.utils.FileUtil;
import restful.utils.ImageBase64Code;
import restful.utils.InterfaceTools;
import restful.utils.Logging;
import restful.utils.MD5Encryption;
import restful.websocket.WebSocketProcess;

@Path("/api")
public class Interface {
	@Context
	private HttpServletRequest request;
	@Context
	private HttpServletResponse response;

	@Resource
	private final static InterfaceTools tools = new InterfaceTools();

	@GET
	@Path("/hello")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String hello() {
//		System.out.println(new Date()+request.getSession().toString());
//		System.out.println(request.getSession().getAttribute("hello"));
//		request.getSession().setAttribute("hello","hello");
		tools.addRe(response);
		CookieTools.addCookie("hello", "jxufe", "/", 60 * 60 * 24 * 7, response);
		return "hello";
	}

	@GET
	@Path("/checkCookieAPI")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String checkCookieAPI(@QueryParam("username") String username) {
		tools.addRe(response);
		return Check(username, request);
	}

	@GET
	@Path("/getAllUsers")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String getAllUsers(@QueryParam("username") String username) {
		tools.addRe(response);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
		List<UserEntity> users = EM.getEntityManager().createNamedQuery("UserEntity.findUserAll", UserEntity.class)
				.getResultList();
		String json = tools.makeJSON(users);
		return tools.makeReturn(json);
	}

	@GET
	@Path("/add")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String add(@QueryParam("Name") String NAME, @QueryParam("PASSWORD") String PASSWORD,
			@QueryParam("NICKNAME") String NICKNAME, @QueryParam("SEX") String SEX) {

		tools.addRe(response);
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", NAME).getResultList();
		if (result.isEmpty()) {
			UserEntity userentity = new UserEntity(NAME, NICKNAME,PASSWORD, SEX);
			// System.out.println(userentity.show());
			tools.commitDB(userentity);
			String json = tools.makeJSON(userentity);

			return tools.makeReturn(json);
		} else
			return tools.makeErReturn(ResultCode.USER_HAS_EXISTED);
	}

	@GET
	@POST
	@Path("/update")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String update(UserEntity userentity) {
		tools.addRe(response);
		return " ";
	}

	@GET
	@POST
	@Path("/delete")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String delete(UserEntity userentity) {
		tools.addRe(response);
		tools.deleteDB(userentity);
		return tools.makeReturn();
	}

	@GET
	@Path("/login")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String denglu(@QueryParam("userName") String NAME, @QueryParam("password") String PASSWORD) {
		tools.addRe(response);
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", NAME).getResultList();
		if (result.isEmpty())
			return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
		else {
			UserEntity userentity = result.get(0);
			if (userentity.checkPass(PASSWORD)) {
//				HttpServletRequest req = (HttpServletRequest) request;
//				userentity.setTOKEN(req.getSession().toString());
				String token = Token.createToken(NAME);
				userentity.setTOKEN(token);
				userentity.setLOGINTIME(new Date());
				tools.commitDB(userentity);
				CookieTools.addCookie("token", token, "/", 60 * 60 * 24 * 7, response);
				return tools.makeReturn(tools.makeJSON(userentity));
			} else {
				return tools.makeErReturn(ResultCode.USER_PWD_ERROR);
			}
		}
	}

	@POST
	@Path("/updateHead")
//	@Consumes("application/json;charset=UTF-8")
//	@Produces("application/json;charset=UTF-8")
	public String updateHead(
//			@FormParam("image") String image64,
//			@FormParam("userName") String userName,
			Map<String, Object> jsonParam) {
		tools.addRe(response);
		JSONObject jo = new JSONObject(jsonParam);
//		System.out.println(jo);  
		String image64 = jo.getString("image");
		String userName = jo.getString("userName");
		String check = Check(userName, request);
		if (!check.equals("ok")) {
			return check;
		}
//		System.out.println(image64);
//		System.out.println(userName);
		UserEntity testPath = new UserEntity();
		String classPath = testPath.getClass().getResource("/").getPath();
		String imagePath = classPath.replaceAll("WEB-INF/classes/", "images/headIcons/");
		if (userName == null || image64 == null)
			return tools.makeErReturn(ResultCode.PARAM_IS_MISS);
		File file = new File(imagePath);
		if (!FileUtil.canWrite(file)) {
			String msg = "headIcons文件夹无写入权限，请检查";
			System.out.println(msg);
			Logging.Log(this.getClass().getName(), msg, userName);
		}
//		System.out.println(imagePath+userName+".png");
		ImageBase64Code.GenerateImage(image64, imagePath + userName + ".png");
		return tools.makeReturn();
	}

	@GET
	@Path("/getUser")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String getUser(@QueryParam("userName") String NAME) {
		tools.addRe(response);
		String check = Check(NAME, request);
		if (!check.equals("ok")) {
			return check;
		}
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", NAME).getResultList();
		if (result.isEmpty())
			return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
		else {
			UserEntity userentity = result.get(0);
//			if(userentity.checkPass(PASSWORD)) {
////				HttpServletRequest req = (HttpServletRequest) request;
////				userentity.setTOKEN(req.getSession().toString());
//				userentity.setLOGINTIME(new Date());
//				tools.commitDB(userentity);
			return tools.makeReturn(tools.makeJSON(userentity));
//			}
//			else
//			{
//				return tools.makeErReturn(ResultCode.USER_PWD_ERROR);
//			}
		}
	}

	@GET
	@Path("/CPWD")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String CPWD(@QueryParam("userName") String NAME, @QueryParam("Opassword") String Opassword,
			@QueryParam("Npassword") String Npassword, @QueryParam("fromUser") String fromUser) {
		tools.addRe(response);
		if (fromUser != null) {
			String check = Check(fromUser, request);
			if (!check.equals("ok")) {
				return check;
			}
			List<UserEntity> result = EM.getEntityManager()
					.createNamedQuery("UserEntity.findUserByName", UserEntity.class).setParameter("NAME", fromUser)
					.getResultList();
			if (result.isEmpty())
				return tools.makeErReturn(ResultCode.PARAM_IS_INVALID);
			UserEntity userentity = result.get(0);
			if (userentity.getADMIN() != 1)
				return tools.makeErReturn(ResultCode.USER_PER_LOW);
			List<UserEntity> result1 = EM.getEntityManager()
					.createNamedQuery("UserEntity.findUserByName", UserEntity.class).setParameter("NAME", NAME)
					.getResultList();
			if (result.isEmpty())
				return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
			else {
				UserEntity userentity1 = result.get(0);
				userentity1.setPASSWORD(MD5Encryption.getSaltMD5(Npassword, userentity.getSALT()));
				tools.commitDB(userentity1);
				return tools.makeReturn();
			}
		} else {
			String check = Check(NAME, request);
			if (!check.equals("ok")) {
				return check;
			}
			List<UserEntity> result = EM.getEntityManager()
					.createNamedQuery("UserEntity.findUserByName", UserEntity.class).setParameter("NAME", NAME)
					.getResultList();
			if (result.isEmpty())
				return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
			else {
				UserEntity userentity = result.get(0);
				if (userentity.getADMIN() != 1) {
					if (!userentity.checkPass(Opassword)) {
						return tools.makeErReturn(ResultCode.USER_OPWD_ERROR);
					}
				}
				userentity.setPASSWORD(MD5Encryption.getSaltMD5(Npassword, userentity.getSALT()));
				tools.commitDB(userentity);
				return tools.makeReturn();
			}
		}
	}

	@GET
	@Path("/CInfo")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String CInfo(@QueryParam("fromUser") String fromUser, @QueryParam("userName") String userName,
			@QueryParam("newUserName") String newUserName, @QueryParam("nickname") String nickname,
			@QueryParam("sex") String sex, @QueryParam("admin") String admin) {
		tools.addRe(response);
		if (!userName.equals(fromUser)) {
			String check = Check(fromUser, request);
			if (!check.equals("ok")) {
				return check;
			}
			List<UserEntity> result = EM.getEntityManager()
					.createNamedQuery("UserEntity.findUserByName", UserEntity.class).setParameter("NAME", fromUser)
					.getResultList();
			if (result.isEmpty())
				return tools.makeErReturn(ResultCode.PARAM_IS_INVALID);
			UserEntity userentity = result.get(0);
			if (userentity.getADMIN() != 1)
				return tools.makeErReturn(ResultCode.USER_PER_LOW);
		} else {
			String check = Check(userName, request);
			if (!check.equals("ok")) {
				return check;
			}
		}
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", userName).getResultList();
		if (result.isEmpty())
			return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
		else {
			UserEntity userentity = result.get(0);
			if (newUserName != null) {
				userentity.setNAME(newUserName);
				UserEntity testPath = new UserEntity();
				String classPath = testPath.getClass().getResource("/").getPath();
				String imagePath = classPath.replaceAll("WEB-INF/classes/", "images/headIcons/");
				String oldPath = imagePath + userName + ".png";
				String newPath = imagePath + newUserName + ".png";
				File file = new File(imagePath);
				if (!FileUtil.canRead(file)) {
					if (!FileUtil.renameFile(oldPath, newPath)) {
						String msg = "用户名" + userName + "修改为" + newUserName + "，原头像存在，但重命名失败。";
						System.out.println(msg);
						Logging.Log(this.getClass().getName(), msg, userName);
					}
				}
			}
			if (nickname != null)
				userentity.setNICKNAME(nickname);
			if (sex != null) {
				if (sex.equals("男"))
					userentity.setSEX(1);
				else if (sex.equals("女"))
					userentity.setSEX(0);
				else
					return tools.makeErReturn(ResultCode.PARAM_IS_INVALID);
			}
			if (admin != null) {
				if (admin.equals("是"))
					userentity.setADMIN(1);
				else
					userentity.setADMIN(0);
			}
			tools.commitDB(userentity);
			return tools.makeReturn();
		}
	}

	public String Check(String username, HttpServletRequest request) {
		tools.addRe(response);
		if (username == null) {
			username = getUsernameFromCookie(request);
			if (username == null)
				return tools.makeErReturn(ResultCode.USER_TOKEN_MISS);
		}
		if (!Token.checkToken(username, CookieTools.getCookie("token", request))) {
			return tools.makeErReturn(ResultCode.USER_TOKEN_ERROR);
		}
		return "ok";
	}

	public String getUsernameFromCookie(HttpServletRequest request) {
		tools.addRe(response);
		String text = CookieTools.getCookie("loginName", request);
		String username = null;
		if (text == null)
			return null;
		Base64.Decoder decoder = Base64.getDecoder();
		byte[] textByte = null;
		try {
			username = new String(decoder.decode(text), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			return null;
		}
		return username;
	}

	@GET
	@Path("/makeNewGame")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String makeNewGame(@QueryParam("Dan") int Dan, @QueryParam("Total") int Total) {
		tools.addRe(response);
		String username = getUsernameFromCookie(request);
		if (username == null)
			return tools.makeErReturn(ResultCode.USER_TOKEN_ERROR);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", username).getResultList();
		UserEntity userentity = result.get(0);
		if (result.isEmpty())
			return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
		else {
			List<GameEntity> games = EM.getEntityManager().createNamedQuery("GameEntity.findGameAll", GameEntity.class)
					.getResultList();
			GameEntity game = games.get(games.size() - 1);
			GameEntity gameEntity = new GameEntity(userentity.getID(), Dan, Total);
			gameEntity.setID(game.getID() + 1);
			tools.commitDB(gameEntity);
			String json = tools.makeJSON(gameEntity);
			return tools.makeReturn(json);
		}
	}

	@GET
	@Path("/getMyGame")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String getMyGame(@QueryParam("id") int id, @QueryParam("type") String RoomType) {
		tools.addRe(response);
		String username = getUsernameFromCookie(request);
		if (username == null)
			return tools.makeErReturn(ResultCode.USER_TOKEN_ERROR);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
//		if ((id + "").equals("")) {
//			List<UserEntity> result;
//			result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
//					.setParameter("NAME", username).getResultList();
//			UserEntity userentity = result.get(0);
//			if (result.isEmpty())
//				return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
//			else
//				id = userentity.getID();
//		}
		
		
//		if(RoomType.equals("normal")) {
//			games = EM.getEntityManager().createNamedQuery("GameEntity.findGameByUseridAndStatus", GameEntity.class)
//				.setParameter("USERID", id).setParameter("STATUS", 1).getResultList();
//		}
//		else if(RoomType.equals("guan")){
//			games = EM.getEntityManager().createNamedQuery("GameEntity.findGameByStatus", GameEntity.class)
//					.setParameter("STATUS", 0).getResultList();
//		}
//		else if(RoomType.equals("lu")) {
//			games = EM.getEntityManager().createNamedQuery("GameEntity.findGameByUseridAndStatus", GameEntity.class)
//					.setParameter("USERID", id).setParameter("STATUS", -1).getResultList();
//		}
		
		List<GameEntity> games = null;
//		games = EM.getEntityManager().createNamedQuery("GameEntity.findGameByUserid", GameEntity.class)
//				.setParameter("USERID", id).getResultList();
		games = EM.getEntityManager().createNamedQuery("GameEntity.findGameAll", GameEntity.class).getResultList();
		if (games.isEmpty())
			return tools.makeReturn();
		String json = tools.makeJSON(games);
		System.out.println(tools.makeReturn(json));
		return tools.makeReturn(json);

	}

	@GET
	@Path("/initWS")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String initWS() {
		tools.addRe(response);
		String username = getUsernameFromCookie(request);
		if (username == null)
			return tools.makeErReturn(ResultCode.NEED_LOGIN);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
		return ChatTools.setCurUser(request.getSession(), username);
	}

	@GET
	@Path("/OLuser")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String OLuser() {
		tools.addRe(response);
		String username = getUsernameFromCookie(request);
		if (username == null)
			return tools.makeErReturn(ResultCode.NEED_LOGIN);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
		String user = "";
		for (String key : ChatTools.getClients().keySet()) {
			if (key.equals(username))
				continue;
			if (user.length() == 0)
				user = key;
			else
				user = user + ";" + key;
		}

		return tools.makeReturn(user);
	}

	@GET
	@Path("/talk")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String talk(@QueryParam("type") String type, @QueryParam("TO") String to, @QueryParam("msg") String message,
			@QueryParam("room") String room, @QueryParam("myid") String myid, @QueryParam("x") String x,
			@QueryParam("y") String y, @QueryParam("Black") String Black, @QueryParam("Rtime") String Rtime) {
		tools.addRe(response);
		if (to == null && !type.equals("outT") && !type.equals("Win")) {
			return tools.makeErReturn(ResultCode.PARAM_IS_MISS);
		}
		String username = getUsernameFromCookie(request);
		if (username == null)
			return tools.makeErReturn(ResultCode.NEED_LOGIN);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
		HashMap<String, Object> msg = new HashMap<>();
		if (type.equals("agree")) {
			msg.put("type", type);
			msg.put("msg", message);
			msg.put("from", username);
			msg.put("room", room);
			int roomId = Integer.parseInt(room);
			List<GameEntity> games = EM.getEntityManager().createNamedQuery("GameEntity.findGameById", GameEntity.class)
					.setParameter("ID", roomId).getResultList();
			GameEntity game = games.get(0);
			game.setUSER2ID(Integer.parseInt(myid));
			tools.commitDB(game);
//			return WebSocketProcess.sendMessageToUser(username, to, new JSONObject(msg).toString());
//				String json = tools.makeJSON(gameEntity);
		} else if (type.equals("ti")) {
			int roomId = Integer.parseInt(room);
			List<GameEntity> games = EM.getEntityManager().createNamedQuery("GameEntity.findGameById", GameEntity.class)
					.setParameter("ID", roomId).getResultList();
			GameEntity game = games.get(0);
			game.setUSER2ID(0);
			tools.commitDB(game);
			msg.put("type", type);
			msg.put("msg", message);
			msg.put("from", username);
			msg.put("room", room);

		} else if (type.equals("exit")) {
			int roomId = Integer.parseInt(room);
			List<GameEntity> games = EM.getEntityManager().createNamedQuery("GameEntity.findGameById", GameEntity.class)
					.setParameter("ID", roomId).getResultList();
			GameEntity game = games.get(0);
			game.setUSER2ID(0);
			tools.commitDB(game);
			msg.put("type", type);
			msg.put("msg", message);
			msg.put("from", username);
			msg.put("room", room);

		} else if (type.equals("openG")) {
			msg.put("type", type);
			msg.put("msg", message);
			msg.put("from", username);
			msg.put("room", room);
			AsyncFun.AsyncOpenGame(room);
		} else if (type.equals("makeQ")) {
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("x", x);
			msg.put("y", y);
			msg.put("Black", Black);
			msg.put("Rtime", Rtime);
			AsyncFun.AsyncSaveGongBangData(new JSONObject(msg).toString(), room);
			AsyncFun.AsyncToWatcher(room, new JSONObject(msg).toString());
		} else if (type.equals("outT")) {
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("Black", Black);
			msg.put("Rtime", Rtime);
			AsyncFun.AsyncSaveGongBangData(new JSONObject(msg).toString(), room, -1);
			return tools.makeReturn(new JSONObject(msg).toString());
		} else if (type.equals("Win")) {
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("Black", Black);
			AsyncFun.AsyncSaveGongBangData(new JSONObject(msg).toString(), room, -1);
		} else if (type.equals("pingok")) {
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("Black", Black);
			msg.put("Rtime", Rtime);
			AsyncFun.AsyncToWatcher(room, new JSONObject(msg).toString());
			AsyncFun.AsyncSaveGongBangData(new JSONObject(msg).toString(), room, -1);
		} else if (type.equals("huiok")) {
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("x", x);
			msg.put("y", y);
			msg.put("Black", Black);
			msg.put("Rtime", Rtime);
			AsyncFun.AsyncToWatcher(room, new JSONObject(msg).toString());
			AsyncFun.AsyncSaveGongBangData(new JSONObject(msg).toString(), room, -1);
		} else if (type.equals("shu")) {
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("Rtime", Rtime);
			AsyncFun.AsyncToWatcher(room, new JSONObject(msg).toString());
			AsyncFun.AsyncSaveGongBangData(new JSONObject(msg).toString(), room, -1);
		} else {
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("x", x);
			msg.put("y", y);
			msg.put("Black", Black);
			msg.put("Rtime", Rtime);

		}
		return WebSocketProcess.sendMessageToUser(username, to, new JSONObject(msg).toString());
	}

	@GET
	@Path("/watch")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String watch(@QueryParam("type") String type, @QueryParam("TO") String to,
			@QueryParam("room") String room, @QueryParam("username") String username,
			@QueryParam("t1") String t1, @QueryParam("t2") String t2,
			@QueryParam("t3") String t3, @QueryParam("t4") String t4,
			@QueryParam("chess") String chess) {
		if (username == null)
			username = getUsernameFromCookie(request);
		if (username == null)
			return tools.makeErReturn(ResultCode.NEED_LOGIN);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
		WebSocketProcess.newWatcher(username, room);
		HashMap<String, Object> msg = new HashMap<>();
		if(type.equals("watch"))
		{
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
		}
		else if(type.equals("rewatch")){
			msg.put("type", type);
			msg.put("from", username);
			msg.put("room", room);
			msg.put("t1", t1);
			msg.put("t2", t2);
			msg.put("t3", t3);
			msg.put("t4", t4);
			msg.put("t4", t4);
			msg.put("chess", chess);
		}
		return WebSocketProcess.sendMessageToUser(username, to, new JSONObject(msg).toString());
	}
	
	@GET
	@Path("/watchTest")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String watchTest(@QueryParam("type") String type, @QueryParam("TO") String to,
			@QueryParam("room") String room, @QueryParam("username") String username,@QueryParam("msg") String msg) {
		if (username == null)
			username = getUsernameFromCookie(request);
		if (username == null)
			return tools.makeErReturn(ResultCode.NEED_LOGIN);
		String check = Check(username, request);
		if (!check.equals("ok")) {
			return check;
		}
		AsyncFun.AsyncToWatcher(room, msg);
		return tools.makeReturn();
	}
}
