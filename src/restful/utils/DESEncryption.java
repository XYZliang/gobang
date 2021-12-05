package restful.utils;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

public class DESEncryption {
	/**
	 * DES加密 解密算法
	 * @author xyzliang
	 *
	 */
    private static final String DES = "DES";
    private static final String ENCODE = "GBK";
    private static final String defaultKey = "netwxactive";

    /**
     * 使用 默认key 加密
     *
     * @param data 待加密数据
     * @return
     * @throws Exception
     */
    public static String encrypt(String data) throws Exception {
      byte[] bt = encrypt(data.getBytes(ENCODE), defaultKey.getBytes(ENCODE));
      Base64.Encoder encoder = Base64.getEncoder();
      String strs = encoder.encodeToString(bt);
      return strs;
    }

    /**
     * 使用 默认key 解密
     *
     * @param data 待解密数据
     * @return
     * @throws IOException
     * @throws Exception
     */
    public static String decrypt(String data) throws IOException, Exception {
      if (data == null) return null;
      Base64.Decoder decoder = Base64.getDecoder();
      byte[] buf = decoder.decode(data);
      byte[] bt = decrypt(buf, defaultKey.getBytes(ENCODE));
      return new String(bt, ENCODE);
    }

    /**
     * Description 根据键值进行加密
     *
     * @param data 待加密数据
     * @param key 密钥
     * @return
     * @throws Exception
     */
    public static String encrypt(String data, String key) throws Exception {
      byte[] bt = encrypt(data.getBytes(ENCODE), key.getBytes(ENCODE));
      Base64.Encoder encoder = Base64.getEncoder();
      String strs = encoder.encodeToString(bt);
      return strs;
    }

    /**
     * 根据键值进行解密
     *
     * @param data 待解密数据
     * @param key 密钥
     * @return
     * @throws IOException
     * @throws Exception
     */
    public static String decrypt(String data, String key) throws IOException, Exception {
      if (data == null) return null;
      Base64.Decoder decoder = Base64.getDecoder();
      byte[] buf = decoder.decode(data);
      byte[] bt = decrypt(buf, key.getBytes(ENCODE));
      return new String(bt, ENCODE);
    }

    /**
     * Description 根据键值进行加密
     *
     * @param data
     * @param key 加密键byte数组
     * @return
     * @throws Exception
     */
    private static byte[] encrypt(byte[] data, byte[] key) throws Exception {
      // 生成一个可信任的随机数源
      SecureRandom sr = new SecureRandom();
      // 从原始密钥数据创建DESKeySpec对象
      DESKeySpec dks = new DESKeySpec(key);
      // 创建一个密钥工厂，然后用它把DESKeySpec转换成SecretKey对象
      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DES);
      SecretKey securekey = keyFactory.generateSecret(dks);
      // Cipher对象实际完成加密操作
      Cipher cipher = Cipher.getInstance(DES);
      // 用密钥初始化Cipher对象
      cipher.init(Cipher.ENCRYPT_MODE, securekey, sr);
      return cipher.doFinal(data);
    }

    /**
     * Description 根据键值进行解密
     *
     * @param data
     * @param key 加密键byte数组
     * @return
     * @throws Exception
     */
    private static byte[] decrypt(byte[] data, byte[] key) throws Exception {
      // 生成一个可信任的随机数源
      SecureRandom sr = new SecureRandom();

      // 从原始密钥数据创建DESKeySpec对象
      DESKeySpec dks = new DESKeySpec(key);

      // 创建一个密钥工厂，然后用它把DESKeySpec转换成SecretKey对象
      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DES);
      SecretKey securekey = keyFactory.generateSecret(dks);

      // Cipher对象实际完成解密操作
      Cipher cipher = Cipher.getInstance(DES);

      // 用密钥初始化Cipher对象
      cipher.init(Cipher.DECRYPT_MODE, securekey, sr);

      return cipher.doFinal(data);
    }
    public static void main(String[] args){
        String data = "我是需要被加密的数据";
        // 这里的key长度必须大于8位
        String key = "12345678";
        System.out.println("初始数据===>" + data);
        try {
            System.out.println();
            System.out.println(">>>>>>>>>>根据预定秘钥加密后：" + encrypt(data, key));
            System.out.println(">>>>>>>>>>根据预定秘钥解密后：" + decrypt(encrypt(data, key), key));

            System.out.println("==========================================");
            String encrypt = encrypt(data);
            System.out.println(">>>>>>>>>>默认秘钥加密后：" + encrypt);
            System.out.println(">>>>>>>>>>默认秘钥解密后：" + decrypt(encrypt));
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
