package restful.bean.Result;

public class ResResult<T> {
	/** 1.status状态值：代表本次请求response的状态结果。 */
	private Integer status;
	/** 2.response描述：对本次状态码的描述。 */
	private String desc;
	/** 3.1 data数据：本次返回的数据。 */
	private T data;

	/** 成功，创建ResResult：没data数据 */
	public static ResResult suc() {
		ResResult result = new ResResult();
		result.setResultCode(ResultCode.SUCCESS);
		return result;
	}

	/** 成功，创建ResResult：有data数据 */
	public static ResResult suc(Object data) {
		ResResult result = new ResResult();
		result.setResultCode(ResultCode.SUCCESS);
		result.setData(data);
		return result;
	}

	/** 失败，指定status、desc */
	public static ResResult fail(Integer status, String desc) {
		ResResult result = new ResResult();
		result.setStatus(status);
		result.setDesc(desc);
		return result;
	}

	/** 失败，指定ResultCode枚举 */
	public static ResResult fail(ResultCode resultCode) {
		ResResult result = new ResResult();
		result.setResultCode(resultCode);
		return result;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	/** 把ResultCode枚举转换为ResResult */
	private void setResultCode(ResultCode code) {
		this.status = code.code();
		this.desc = code.message();
	}

}
