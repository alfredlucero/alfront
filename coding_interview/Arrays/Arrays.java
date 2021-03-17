package coding_interview.Arrays;
import java.util.ArrayList;
import java.util.Collections;

// Can contain anything, fixed size, can access any element of array through index in O(1) constant time aka random access
// Getting/setting is O(1)
// Inserting like insert(index, value) -> O(n) linear time where n is the size of the array; need to copy up after and insert
// Deleting like delete(index) -> O(n) linear time and must copy down/overwrite it
// If array is full, may need dynamic arrays and double size of array, copy elements from old to new and insert
public class Arrays {
  public static void main(String[] args) {
    // Size of array cannot be modified but have to create a new array if you want to add/remove from array
    String[] fruits = { "apple", "orange", "peach", "berry" };
    System.out.println(fruits[0] + "length" + fruits.length);

    for (String fruit : fruits) {
      System.out.println(fruit);
    }

    int[] numbers = { 1, 2, 3, 4 };

    for (int i = 0; i < numbers.length; i++) {
      System.out.println(numbers[i]);
    }

    int[][] twoDimensional = { {1,2,3,4}, {1,2,3} };

    // Using ArrayList instead as it is a resizable array
    ArrayList<String> cars = new ArrayList();
    cars.add("Land Rover");
    cars.add("Lexus");
    cars.add("BMW");
    cars.add("Chevy");
    System.out.println(cars);
    System.out.println(cars.get(0));

    cars.set(0, "Land Rover Discovery Sport");
    cars.remove(2);
    // cars.clear();
    System.out.println("Num cars: " + cars.size());

    for (int i = 0; i < cars.size(); i++) {
      System.out.println(cars.get(i));
    }

    Collections.sort(cars);
    for (String car : cars) {
      System.out.println(car);
    }
  } 
}
