package lambda;

import java.io.File;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.s3.transfer.MultipleFileDownload;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Handler value: example.Handler
public class Handler implements RequestHandler<Map<String, String>, String> {
  Gson gson = new GsonBuilder().setPrettyPrinting().create();
  private static final Logger logger = LoggerFactory.getLogger(Handler.class);
  private static final String MIGRATION_LOCATION = "/tmp/migrations";

  @Override
  public String handleRequest(Map<String, String> event, Context context) {
    try {
      logger.info("EVENT: " + gson.toJson(event));

      String bucket = System.getenv("S3_BUCKET");
      String key = System.getenv("S3_KEY");

      TransferManager transferManager = TransferManagerBuilder.defaultTransferManager();
      File destDir = new File(MIGRATION_LOCATION);
      logger.info("Set up transfer manager, transferring to {}", destDir.toString());
      MultipleFileDownload download = transferManager.downloadDirectory(bucket, key, destDir);
      logger.info("Started download process");
      download.waitForCompletion();
      logger.info("Completed download process");

      String dbUrl = System.getenv("DB_URL");
      String dbUser = System.getenv("DB_USERNAME");
      String dbPassword = System.getenv("DB_PASSWORD");
      Flyway flyway = Flyway.configure().dataSource(dbUrl, dbUser, dbPassword).locations("filesystem:" + MIGRATION_LOCATION).load();

      flyway.migrate();
      logger.info("Successfully migrated");
      return "OK";
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    } catch (FlywayException f) {
      logger.info("Unsuccessful Flyway migration");
      throw new RuntimeException(f);
    }
  }
}