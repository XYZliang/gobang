package restful.utils;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;

import restful.database.EM;
import restful.entity.LogEntity;
import restful.entity.UserEntity;

public class Logging {

	public static void Log(String className, String message) {
		LogEntity log = new LogEntity(className, message);
		Do(log);
	}

	public static void Log(String className, String message, Integer user) {
		LogEntity log = new LogEntity(className, message, user);
		Do(log);
	}
	
	public static void Log(String className, String message, String username) {
		List<UserEntity> result = EM.getEntityManager().createNamedQuery("UserEntity.findUserByName", UserEntity.class)
				.setParameter("NAME", username).getResultList();
		LogEntity log ;
		if(result.isEmpty())
			log=new LogEntity(className, message);
		else
			log = new LogEntity(className, message, result.get(0).getID());
		Do(log);
	}

	private static void Do(LogEntity log) {
		if (GetProperties.getProperty("console").equals("true")) {
			printConsole(log);
		}
		if (GetProperties.getProperty("log").equals("true")) {
			sendDatabase(log);
		}
	}

	private static void sendDatabase(LogEntity log) {
		System.out.println("log"+log);
		log = EM.getEntityManager().merge(log);
		EM.getEntityManager().persist(log);
		EM.getEntityManager().getTransaction().commit();
		return;
	}

	private static void printConsole(LogEntity log) {
		try {
			Object2JSON.objToJson(log);
		} catch (JsonProcessingException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
	}
}
