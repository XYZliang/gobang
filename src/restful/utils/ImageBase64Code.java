package restful.utils;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLConnection;
import java.util.Base64;

public class ImageBase64Code {
	/**
	 * 本地图片转化成js base64字符串
	 * 
	 * @param imgPath
	 * @return
	 */
	public static String GetImageStr(String imgPath) {// 将图片文件转化为字节数组字符串，并对其进行Base64编码处理

		FileInputStream inputFile = null;
		String mimeType = "image/png";
		try {
			inputFile = new FileInputStream(imgPath);
			mimeType = URLConnection.guessContentTypeFromStream(new BufferedInputStream(inputFile));
		} catch (IOException e) {
			e.printStackTrace();
		}
		String imgFile = imgPath;// 待处理的图片
		InputStream in = null;
		byte[] data = null;
		String encode = null; // 返回Base64编码过的字节数组字符串
		// 对字节数组Base64编码
		Base64.Encoder encoder = Base64.getEncoder();
		try {
			// 读取图片字节数组
			in = new FileInputStream(imgFile);
			data = new byte[in.available()];
			in.read(data);
			encode = encoder.encodeToString(data);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return "data:" + mimeType + ";base64," + encode;
	}

	/**
	 * base64字符串转化成图片
	 *
	 * @param imgData     js 图片编码
	 * @param imgFilePath 存放到本地路径
	 * @return
	 * @throws IOException
	 */
	@SuppressWarnings("finally")
	public static boolean GenerateImage(String imgData, String imgFilePath) { // 对字节数组字符串进行Base64解码并生成图片
		imgData = imgData.replaceAll("data:image/jpeg;base64,", "");
		imgData = imgData.replaceAll("data:image/jpg;base64,", "");
		imgData = imgData.replaceAll("data:image/png;base64,", "");
//        System.out.println(imgData);
		if (imgData == null) // 图像数据为空
			return false;
		Base64.Decoder decoder = Base64.getDecoder();
		OutputStream out = null;
		try {
			out = new FileOutputStream(imgFilePath);
			// Base64解码
			byte[] b = decoder.decode(imgData);
			for (int i = 0; i < b.length; ++i) {
				if (b[i] < 0) {// 调整异常数据
					b[i] += 256;
				}
			}
			out.write(b);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				out.flush();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return true;
		}
	}
}
