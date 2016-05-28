import java.io.Console;

public class Solutions {
   public static void main(String[] args) {
      
      Console cnsl = null;
      String name = null;
      String kid = null;
      
      
      
      try{
         // creates a console object
         cnsl = System.console();

         // if console is not null
         if (cnsl != null) {
            
            // read line from the user input
            name = cnsl.readLine("Name: ");
            kid =  cnsl.readLine("KID: ");
            
            // prints
            System.out.println("");
            System.out.println("Name entered : " + name);
            System.out.println("KID entered : " + kid);
         }      
      }catch(Exception ex){
         
         // if any error occurs
         ex.printStackTrace();      
      }
   }
}
                            