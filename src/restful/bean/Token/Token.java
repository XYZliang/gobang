package restful.bean.Token;

import java.io.Reader;
import java.io.StringReader;
import java.util.Date;

import com.fasterxml.jackson.databind.ObjectMapper;

import restful.utils.DESEncryption;
import restful.utils.Logging;

public class Token {
	
	private static final int maxDay = 7;
	private String userName;
	private Date time;
	/**
	 * @return userName
	 */
	public String getUserName() {
		return userName;
	}
	/**
	 * @param userName 要设置的 userName
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}
	/**
	 * @return time
	 */
	public Date getTime() {
		return time;
	}
	/**
	 * @param time 要设置的 time
	 */
	public void setTime(Date time) {
		this.time = time;
	}
	public Token(String userName) {
		super();
		this.userName = userName;
		this.time=new Date();
	}
	public Token() {
		super();
	}
	public static String createToken(String userName) {
		Token token = new Token(userName);
		ObjectMapper mapper = new ObjectMapper();
		String json = null;
		try {
			json = mapper.writeValueAsString(token);
			json = DESEncryption.encrypt(json, userName);
		} catch (Exception e) {
			Logging.Log(token.getClass().getName(), e.toString());
		}
		return json;
	}
	public static boolean checkToken(String userName,String tokenS) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			String json=DESEncryption.decrypt(tokenS,userName);
			Reader reader = new StringReader(json);
			Token token = objectMapper.readValue(reader,Token.class);
			if(!token.userName.equals(userName)){
				return false;
			}
			if(differentDaysByMillisecond(new Date(),token.time)>1.0*maxDay){
				return false;
			}
			return true;
		} catch (Exception e) {
			Token t = new Token(userName);
			Logging.Log(t.getClass().getName(), e.toString());
			return false;
		}
	}
	public static double differentDaysByMillisecond(Date date1,Date date2)
	{
		double days =((date2.getTime() - date1.getTime()*1.0) / (1000*3600*24));
		return days;
	}
}
