package restful.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "GOBANGLOGS")
@JsonIgnoreProperties(ignoreUnknown = true)
public class LogEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int ID;
	private int USERID;
	private String CLASSPATH;
	private String DESCRIPTION;
	private Date TIME;

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getUSERID() {
		return USERID;
	}

	public void setUSERID(int uSERID) {
		USERID = uSERID;
	}

	public String getCLASSPATH() {
		return CLASSPATH;
	}

	public void setCLASSPATH(String cLASSPATH) {
		CLASSPATH = cLASSPATH;
	}

	public String getDESCRIPTION() {
		return DESCRIPTION;
	}

	public void setDESCRIPTION(String dESCRIPTION) {
		DESCRIPTION = dESCRIPTION;
	}

	public Date getTIME() {
		return TIME;
	}

	public void setTIME(Date tIME) {
		TIME = tIME;
	}

	public void setTIME() {
		TIME = new Date();
	}

	public LogEntity(String cLASSPATH, String dESCRIPTION, int uSERID) {
		super();
		CLASSPATH = cLASSPATH;
		DESCRIPTION = dESCRIPTION;
		USERID = uSERID;
		TIME = new Date();
		USERID=4;

	}

	public LogEntity(String cLASSPATH, String dESCRIPTION) {
		super();
		CLASSPATH = cLASSPATH;
		DESCRIPTION = dESCRIPTION;
		TIME = new Date();
		USERID=4;
	}

	public LogEntity() {
		super();
	}

	@Override
	public String toString() {
		return "LogEntity [ID=" + ID + ", USERID=" + USERID + ", CLASSPATH=" + CLASSPATH + ", DESCRIPTION="
				+ DESCRIPTION + ", TIME=" + TIME + "]";
	}
	
	

}
