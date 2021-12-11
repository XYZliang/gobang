package restful.utils;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import restful.database.EM;
import restful.entity.GameEntity;

public class AsyncFun {
	private final static InterfaceTools tools = new InterfaceTools();

	public static void saveGongBangData(String json, String Roomid) {
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
				tools.commitDB(game);
			}
		});
	}

	public synchronized static void AsyncSaveGongBangData(String json, String Roomid) {
		saveGongBangData(json, Roomid);
	}
}
