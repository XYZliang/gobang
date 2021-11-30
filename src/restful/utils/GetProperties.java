package restful.utils;

import java.io.IOException;
import java.util.Properties;

public class GetProperties {
	public static String getProperty(String arg) {

		Properties properties = new Properties();
		String re = "null";
		try {
			// 加载配置文件
			properties.load(GetProperties.class.getClassLoader().getResourceAsStream("application.properties"));
			// 乱码处理：(1)选中配置文件-->右键-->Properties-->text file encoding
//	             (2)使用上述代码会出现乱码情况时，修改为在load配置文件时指定编码格式为UTF-8
//	             properties.load(new InputStreamReader(MainTest.class.getClassLoader().getResourceAsStream("application.properties"), "UTF-8"));
//	            遍历配置文件中key和value
//	            for (Map.Entry<Object, Object> entry : properties.entrySet()) {
//	                System.out.println(entry.getKey() + ":" + entry.getValue());
//	            }
			if (properties.getProperty(arg) != null) {
				re = properties.getProperty(arg);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return re;

	}

}
