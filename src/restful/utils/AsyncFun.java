package restful.utils;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import restful.database.EM;
import restful.entity.GameEntity;

public class AsyncFun {
	private final static InterfaceTools tools = new InterfaceTools();

	public static void saveGongBangData(String json, String Roomid,int s) {
		ExecutorService fixedThreadPool = Executors.newFixedThreadPool(3);
		fixedThreadPool.execute(new Runnable() {
			@Override
			public void run() {
				int roomId = Integer.parseInt(Roomid);
				List<GameEntity> games = EM.getEntityManager()
						.createNamedQuery("GameEntity.findGameById", GameEntity.class).setParameter("ID", roomId)
						.getResultList();
				GameEntity game = games.get(0);
				game.addDATA(json);
				if(s != -2) {
					game.setSTATUS(s);
				}
				tools.commitDB(game);
				fixedThreadPool.shutdown();
			}
		});
	}

	public synchronized static void AsyncSaveGongBangData(String json, String Roomid) {
		saveGongBangData(json, Roomid ,-2);
	}
	public synchronized static void AsyncSaveGongBangData(String json, String Roomid,int finish) {
		saveGongBangData(json, Roomid ,finish);
	}
	
	public static void openGame(String Roomid) {
		ExecutorService fixedThreadPool = Executors.newFixedThreadPool(3);
		fixedThreadPool.execute(new Runnable() {
			@Override
			public void run() {
				int roomId = Integer.parseInt(Roomid);
				List<GameEntity> games = EM.getEntityManager()
						.createNamedQuery("GameEntity.findGameById", GameEntity.class).setParameter("ID", roomId)
						.getResultList();
				GameEntity game = games.get(0);
				game.setSTATUS(0);
				tools.commitDB(game);
				fixedThreadPool.shutdown();
			}
		});
	}
	public synchronized static void AsyncOpenGame(String Roomid) {
		openGame(Roomid);
	}
}
