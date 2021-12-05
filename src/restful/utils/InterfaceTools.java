package restful.utils;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import dm.jdbc.filter.stat.json.JSONArray;
import dm.jdbc.filter.stat.json.JSONObject;
import restful.bean.Result.ResResult;
import restful.bean.Result.ResultCode;
import restful.database.EM;
import restful.entity.UserEntity;

public class InterfaceTools {

	public String makeJSON(UserEntity user) {
		ObjectMapper mapper = new ObjectMapper();
		String json = null;
		try {
			json = mapper.writeValueAsString(user);
		} catch (JsonProcessingException e) {
			Logging.Log(this.getClass().getName(), e.toString());
		}
		json = IgnoreKey(json);
		json = json.replace("\": \"{", "\": {").replace("}\"}", "}}");
		return json;
	}

	public String makeJSON(List<UserEntity> users) {
		ObjectMapper mapper = new ObjectMapper();
		String json = null;
		try {
			json = mapper.writeValueAsString(users);
		} catch (JsonProcessingException e) {
			Logging.Log(this.getClass().getName(), e.toString());
		}
//		System.out.println(json);
		return IgnoreKeys(json);
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

	public void commitDB(UserEntity userentity) {
		userentity = EM.getEntityManager().merge(userentity);
		EM.getEntityManager().persist(userentity);
		EM.getEntityManager().getTransaction().commit();
	}

	public void deleteDB(UserEntity userentity) {
		userentity = EM.getEntityManager().merge(userentity);
		EM.getEntityManager().remove(userentity);
		EM.getEntityManager().getTransaction().commit();
	}

	private String IgnoreKey(String json) {
		JSONObject jsonArray = new JSONObject(json);
		jsonArray.remove("id");
		jsonArray.remove("logintime");
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
}
