package restful.api;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import dm.jdbc.filter.stat.json.JSONObject;
import restful.bean.Result.ResultCode;
import restful.database.EM;
import restful.entity.UserEntity;
import restful.utils.Encryption;
import restful.utils.FileUtil;
import restful.utils.ImageBase64Code;
import restful.utils.InterfaceTools;
import restful.utils.Logging;

@Path("/api")
public class Interface {
	@Resource
	private final InterfaceTools tools = new InterfaceTools();

	@GET
	@Path("/hello")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String hello() {
		System.out.println(new Date());
		return "hello";
	}

	@GET
	@Path("/getAllUsers")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String getAllUsers() {
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
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", NAME).getResultList();
		if (result.isEmpty()) {
			UserEntity userentity = new UserEntity(NAME, PASSWORD, NICKNAME, SEX);
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
		return " ";
	}

	@GET
	@POST
	@Path("/delete")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String delete(UserEntity userentity) {
		tools.deleteDB(userentity);
		return tools.makeReturn();
	}

	@GET
	@Path("/login")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String denglu(@QueryParam("userName") String NAME, @QueryParam("password") String PASSWORD) {
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", NAME).getResultList();
		if (result.isEmpty())
			return tools.makeErReturn(ResultCode.USER_NOT_EXISTED);
		else {
			UserEntity userentity = result.get(0);
			if (userentity.checkPass(PASSWORD)) {
//				HttpServletRequest req = (HttpServletRequest) request;
//				userentity.setTOKEN(req.getSession().toString());
				userentity.setLOGINTIME(new Date());
				tools.commitDB(userentity);
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
		JSONObject jo = new JSONObject(jsonParam);
//		System.out.println(jo);  
		String image64 = jo.getString("image");
		String userName = jo.getString("userName");
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
		if (fromUser != null) {
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
				userentity1.setPASSWORD(Encryption.getSaltMD5(Npassword, userentity.getSALT()));
				tools.commitDB(userentity1);
				return tools.makeReturn();
			}
		} else {
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
				userentity.setPASSWORD(Encryption.getSaltMD5(Npassword, userentity.getSALT()));
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
		if (!userName.equals(fromUser)) {
			List<UserEntity> result = EM.getEntityManager()
					.createNamedQuery("UserEntity.findUserByName", UserEntity.class).setParameter("NAME", fromUser)
					.getResultList();
			if (result.isEmpty())
				return tools.makeErReturn(ResultCode.PARAM_IS_INVALID);
			UserEntity userentity = result.get(0);
			if (userentity.getADMIN() != 1)
				return tools.makeErReturn(ResultCode.USER_PER_LOW);
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
}
