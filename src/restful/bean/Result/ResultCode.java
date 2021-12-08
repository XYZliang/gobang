package restful.bean.Result;

public enum ResultCode {

	/* 成功状态码 */
	SUCCESS(0, "成功"),

	/* 系统500错误 */
	SYSTEM_ERROR(10000, "系统异常，请稍后重试"),

	/* 参数错误：10001-19999 */
	PARAM_IS_INVALID(10001, "参数无效"), PARAM_IS_MISS(10002, "缺少参数"),NEED_LOGIN(10003, "请先登录"),

	/* 用户错误：20001-29999 */
	USER_HAS_EXISTED(20001, "用户名已存在，请更换用户名"), USER_NOT_EXISTED(20002, "用户不存在"), USER_PWD_ERROR(20003, "用户密码错误"),
	USER_UA_CHANGE(20004, "用户设备变更"),
	USER_OPWD_ERROR(20003, "用户原密码错误"), 
	USER_PER_LOW(20004, "用户权限不足"),
	USER_TOKEN_ERROR(20005, "用户token效验失败，请尝试重新登陆"),
	USER_TOKEN_MISS(20005, "用户token缺失，请尝试重新登陆"),
	USER_LOGINOUT_WS(20005, "该用户已退出，请重新选择用户"),
	
	/* WebSocket错误：30001-39999 */
	SEED_ERR(30001, "WS发送失败");

	private Integer code;

	private String message;

	ResultCode(Integer code, String message) {
		this.code = code;
		this.message = message;
	}

	public static String getMessage(String name) {
		for (ResultCode item : ResultCode.values()) {
			if (item.name().equals(name)) {
				return item.message;
			}
		}
		return name;
	}

	public static Integer getCode(String name) {
		for (ResultCode item : ResultCode.values()) {
			if (item.name().equals(name)) {
				return item.code;
			}
		}
		return null;
	}

	public Integer code() {
		return this.code;
	}

	public String message() {
		return this.message;
	}

	@Override
	public String toString() {
		return this.name();
	}
}
