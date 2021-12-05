package restful.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import restful.utils.MD5Encryption;

@Entity
@Table(name = "GOBANGUSER")
@NamedQueries({ @NamedQuery(name = "UserEntity.findUserAll", query = "SELECT u FROM UserEntity u"),
		@NamedQuery(name = "UserEntity.findUserByName", query = "SELECT u FROM UserEntity u where u.NAME like :NAME") })
public class UserEntity {
	@JsonIgnoreProperties(value = { "ID", "PASSWORD", "SALT", "TOKEN", "LOGINTIME", "UA" })
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonIgnore
	private int ID;
	private String NAME;
	private String NICKNAME;
	private int SEX;
	private int ISADMIN;
	@JsonIgnore
	private String PASSWORD;
	@JsonIgnore
	private String SALT;
	@JsonIgnore
	private String TOKEN;
	private int TIMES;
	private int WINTIMES;
	private int LEVEL;
	@JsonIgnore
	private Date LOGINTIME;
	@JsonIgnore
	private String UA;
	private String DISABLE;

	/**
	 * @return iD
	 */
	public int getID() {
		return ID;
	}

	/**
	 * @return nAME
	 */
	public String getNAME() {
		return NAME;
	}

	/**
	 * @return nICKNAME
	 */
	public String getNICKNAME() {
		return NICKNAME;
	}

	/**
	 * @return sEX
	 */
	public int getSEX() {
		return SEX;
	}

	/**
	 * @return aDMIN
	 */
	public int getADMIN() {
		return ISADMIN;
	}

	/**
	 * @return pASSWORD
	 */
	public String getPASSWORD() {
		return PASSWORD;
	}

	/**
	 * @return sALT
	 */
	public String getSALT() {
		return SALT;
	}

	/**
	 * @return tOKEN
	 */
	public String getTOKEN() {
		return TOKEN;
	}

	/**
	 * @return tIMES
	 */
	public int getTIMES() {
		return TIMES;
	}

	/**
	 * @return lEVEL
	 */
	public int getLEVEL() {
		return LEVEL;
	}

	/**
	 * @param iD 要设置的 iD
	 */
	public void setID(int iD) {
		ID = iD;
	}

	/**
	 * @param nAME 要设置的 nAME
	 */
	public void setNAME(String nAME) {
		NAME = nAME;
	}

	/**
	 * @param nICKNAME 要设置的 nICKNAME
	 */
	public void setNICKNAME(String nICKNAME) {
		NICKNAME = nICKNAME;
	}

	/**
	 * @param sEX 要设置的 sEX
	 */
	public void setSEX(int sEX) {
		SEX = sEX;
	}

	/**
	 * @param aDMIN 要设置的 aDMIN
	 */
	public void setADMIN(int aDMIN) {
		ISADMIN = aDMIN;
	}

	/**
	 * @param pASSWORD 要设置的 pASSWORD
	 */
	public void setPASSWORD(String pASSWORD) {
		PASSWORD = pASSWORD;
	}

	/**
	 * @param sALT 要设置的 sALT
	 */
	public void setSALT(String sALT) {
		SALT = sALT;
	}

	/**
	 * @param tOKEN 要设置的 tOKEN
	 */
	public void setTOKEN(String tOKEN) {
		TOKEN = tOKEN;
	}

	/**
	 * @param lEVEL 要设置的 lEVEL
	 */
	public void setLEVEL(int lEVEL) {
		LEVEL = lEVEL;
	}

	/**
	 * @return wINTIMES
	 */
	public int getWINTIMES() {
		return WINTIMES;
	}

	/**
	 * @param wINTIMES 要设置的 wINTIMES
	 */
	public void setWINTIMES(int wINTIMES) {
		WINTIMES = wINTIMES;
	}

	/**
	 * @return iSADMIN
	 */
	public int getISADMIN() {
		return ISADMIN;
	}

	/**
	 * @param iSADMIN 要设置的 iSADMIN
	 */
	public void setISADMIN(int iSADMIN) {
		ISADMIN = iSADMIN;
	}

	/**
	 * @return uA
	 */
	public String getUA() {
		return UA;
	}

	/**
	 * @param uA 要设置的 uA
	 */
	public void setUA(String uA) {
		UA = uA;
	}

	/**
	 * @return lOGINTIME
	 */
	public Date getLOGINTIME() {
		return LOGINTIME;
	}

	/**
	 * @param lOGINTIME 要设置的 lOGINTIME
	 */
	public void setLOGINTIME(Date lOGINTIME) {
		LOGINTIME = lOGINTIME;
	}

	/**
	 * @param tIMES 要设置的 tIMES
	 */
	public void setTIMES(int tIMES) {
		TIMES = tIMES;
	}

	/**
	 * @return dISABLE
	 */
	public String getDISABLE() {
		return DISABLE;
	}

	/**
	 * @param dISABLE 要设置的 dISABLE
	 */
	public void setDISABLE(String dISABLE) {
		DISABLE = dISABLE;
	}

	public void initZHUCE() {

	}

	public UserEntity(String nAME, String nICKNAME, String pASSWORD, String sEX) {
		super();
		NAME = nAME;
		NICKNAME = nICKNAME;
		if (sEX == "男")
			SEX = 1;
		else if (sEX == "%E7%94%B7")
			SEX = 1;
		else
			SEX = 0;
		LOGINTIME = new Date();
		ISADMIN = 0;
		SALT = MD5Encryption.makeSalt(LOGINTIME);
		PASSWORD = MD5Encryption.getSaltMD5(pASSWORD, SALT);
		TOKEN = "";
		TIMES = 0;
		WINTIMES = 0;
		LEVEL = 0;
		UA = "";
	}

	public UserEntity() {
		super();
	}

	@Override
	public String toString() {
		return "UserEntity [NAME=" + NAME + ", NICKNAME=" + NICKNAME + ", SEX=" + SEX + ", ADMIN=" + ISADMIN
				+ ", TIMES=" + TIMES + ", WINTIMES=" + WINTIMES + ", LEVEL=" + LEVEL + "]";
	}

	public String show() {
		return "UserEntity [ID=" + ID + ", NAME=" + NAME + ", NICKNAME=" + NICKNAME + ", SEX=" + SEX + ", ISADMIN="
				+ ISADMIN + ", PASSWORD=" + PASSWORD + ", SALT=" + SALT + ", TOKEN=" + TOKEN + ", TIMES=" + TIMES
				+ ", WINTIMES=" + WINTIMES + ", LEVEL=" + LEVEL + ", LOGINTIME=" + LOGINTIME + ", UA=" + UA + "]";
	}

	public boolean checkPass(String pass) {
		return (MD5Encryption.getSaltMD5(pass, SALT).toString().equals(PASSWORD));
	}

}