package restful.api;

import java.util.List;

import javax.annotation.Resource;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import restful.bean.Result.ResultCode;
import restful.database.EM;
import restful.entity.UserEntity;
import restful.utils.InterfaceTools;

@Path("/api")
public class Interface {
	@Resource
	private final InterfaceTools tools = new InterfaceTools();
	
	
	@GET
	@POST
	@Path("/hello")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String hello() {
		return "hello";
	}

	@GET
	@POST
	@Path("/getAllUsers")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String getAllUsers() {
		List<UserEntity> users = EM.getEntityManager().createNamedQuery("UserEntity.findUserAll", UserEntity.class)
				.getResultList();
		String json =  tools.makeJSON(users);
		return tools.makeReturn(json);
	}
	
	@GET
	@POST
	@Path("/add")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String add(@QueryParam("Name") String NAME,  
            @QueryParam("PASSWORD") String PASSWORD,  
            @QueryParam("NICKNAME") String NICKNAME,
            @QueryParam("SEX") String SEX) {
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", NAME).getResultList();
		if(result.isEmpty()) {
			UserEntity userentity = new UserEntity(NAME, PASSWORD,NICKNAME,SEX);
			//System.out.println(userentity.show());
			tools.commitDB(userentity);
			String json = tools.makeJSON(userentity);
			return tools.makeReturn(json);	
		}
		else
			return tools.makeErReturn(ResultCode.USER_HAS_EXISTED);
	}
	
	@POST
	@Path("/update")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String update(UserEntity userentity) {
		return " ";
	}
	
	@POST
	@Path("/delete")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String delete(UserEntity userentity) {
		tools.deleteDB(userentity);
		return tools.makeReturn();
	}
	
	@GET
	@POST
	@Path("/denglu")
	@Consumes("application/json;charset=UTF-8")
	@Produces("application/json;charset=UTF-8")
	public String denglu(@QueryParam("Name") String NAME,  
            @QueryParam("PASSWORD") String PASSWORD) {
		UserEntity userentity = new UserEntity();
		tools.commitDB(userentity);
		String json = tools.makeJSON(userentity);
		return tools.makeReturn(json);
	}
}
