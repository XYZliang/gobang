package restful.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "GOBANGGAME")
@NamedQueries({ @NamedQuery(name = "GameEntity.findGameAll", query = "SELECT u FROM GameEntity u"),
		@NamedQuery(name = "GameEntity.findGameByUserid", query = "SELECT u FROM GameEntity u where u.USERID like :USERID"),
})
public class GameEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int ID;
	private int USERID;
	private int USER2ID;
	private String DATA;
	private int ONETIME;
	private int TOTALTIME;
	private int STATUS;
	/**
	 * @return iD
	 */
	public int getID() {
		return ID;
	}
	/**
	 * @param iD 要设置的 iD
	 */
	public void setID(int iD) {
		ID = iD;
	}
	/**
	 * @return uSERID
	 */
	public int getUSERID() {
		return USERID;
	}
	/**
	 * @param uSERID 要设置的 uSERID
	 */
	public void setUSERID(int uSERID) {
		USERID = uSERID;
	}
	/**
	 * @return uSER2ID
	 */
	public int getUSER2ID() {
		return USER2ID;
	}
	/**
	 * @param uSER2ID 要设置的 uSER2ID
	 */
	public void setUSER2ID(int uSER2ID) {
		USER2ID = uSER2ID;
	}
	/**
	 * @return dATA
	 */
	public String getDATA() {
		return DATA;
	}
	/**
	 * @param dATA 要设置的 dATA
	 */
	public void setDATA(String dATA) {
		DATA = dATA;
	}
	/**
	 * @return oNETIME
	 */
	public int getONETIME() {
		return ONETIME;
	}
	/**
	 * @param oNETIME 要设置的 oNETIME
	 */
	public void setONETIME(int oNETIME) {
		ONETIME = oNETIME;
	}
	/**
	 * @return tOTALTIME
	 */
	public int getTOTALTIME() {
		return TOTALTIME;
	}
	/**
	 * @param tOTALTIME 要设置的 tOTALTIME
	 */
	public void setTOTALTIME(int tOTALTIME) {
		TOTALTIME = tOTALTIME;
	}
	/**
	 * @return sTATUS
	 */
	public int getSTATUS() {
		return STATUS;
	}
	/**
	 * @param sTATUS 要设置的 sTATUS
	 */
	public void setSTATUS(int sTATUS) {
		STATUS = sTATUS;
	}
	public GameEntity() {
		super();
	}
	public GameEntity(int uSERID, int oNETIME, int tOTALTIME) {
		super();
		USERID = uSERID;
		ONETIME = oNETIME;
		TOTALTIME = tOTALTIME;
		STATUS = 1;
	}
}
