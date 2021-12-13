package restful.utils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import dm.jdbc.filter.stat.json.JSONArray;
import dm.jdbc.filter.stat.json.JSONObject;
import restful.bean.Result.ResResult;
import restful.bean.Result.ResultCode;
import restful.database.EM;
import restful.entity.UserEntity;

public class InterfaceTools {

	public String makeJSON(Object obj) {
		ObjectMapper mapper = new ObjectMapper();
		String json = null;
		try {
			json = mapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			Logging.Log(this.getClass().getName(), e.toString());
		}
		if (obj instanceof UserEntity) {
			json = IgnoreKey(json);
			json = json.replace("\": \"{", "\": {").replace("}\"}", "}}");
		}
		return json;
	}

	public String makeJSON(List<Object> obj) {
		ObjectMapper mapper = new ObjectMapper();
		String json = null;
		try {
			json = mapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			Logging.Log(this.getClass().getName(), e.toString());
		}
//		System.out.println(json);
		if (obj.get(0) instanceof UserEntity)
			return IgnoreKeys(json);
		return json;
	}

	public String makeReturn(String json) {
		return BeautifyReasult.Do(ResResult.suc(json));
	}

	public String makeReturn() {
		return BeautifyReasult.Do(ResResult.suc());
	}

	public String makeErReturn(Integer status, String json) {
		return BeautifyReasult.Do(ResResult.fail(status, json));
	}

	public String makeErReturn(ResultCode resultCode) {
		return BeautifyReasult.Do(ResResult.fail(resultCode));
	}

	public void commitDB(Object entity) {
		entity = EM.getEntityManager().merge(entity);
		EM.getEntityManager().persist(entity);
		EM.getEntityManager().getTransaction().commit();
	}

	public void deleteDB(UserEntity userentity) {
		userentity = EM.getEntityManager().merge(userentity);
		EM.getEntityManager().remove(userentity);
		EM.getEntityManager().getTransaction().commit();
	}

	private String IgnoreKey(String json) {
		JSONObject jsonArray = new JSONObject(json);
//		jsonArray.remove("id");
//		jsonArray.remove("logintime");
		jsonArray.remove("salt");
		jsonArray.remove("ua");
		jsonArray.remove("token");
		jsonArray.remove("password");
		return jsonArray.toString();
	}

	private String IgnoreKeys(String json) {
		JSONArray jsonArray = new JSONArray(json);
		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject jsonarray = jsonArray.getJSONObject(i);
//			jsonarray.remove("id");
//			jsonarray.remove("logintime");
			jsonarray.remove("salt");
			jsonarray.remove("ua");
			jsonarray.remove("token");
			jsonarray.remove("password");
		}
		return jsonArray.toString();
	}

	public void addRe(HttpServletResponse response) {
		response.setCharacterEncoding("utf-8");
		response.setHeader("Access-Control-Allow-Origin", "allowDomain");
		response.setHeader("Access-Control-Allow-Credentials", "true");
		String headers = "Origin, Accept-Language, Accept-Encoding,X-Forwarded-For, Connection, Accept, User-Agent, Host, Referer,Cookie, Content-Type, Cache-Control";
		response.setHeader("Access-Control-Allow-Headers", headers);
		response.setHeader("Access-Control-Request-Method", "GET,POST");
	}

	public String[] StringArrayQuChong(String[] s) {
		List<String> list = Arrays.asList(s);
		Set<String> set = new HashSet<String>(list);
		String[] rid = (String[]) set.toArray(new String[0]);
		return rid;
	}
}
