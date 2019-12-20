using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace PizzaOlo
{
    class Program
    {
        static void Main(string[] args)
        {
            string myPath = @"E:\Projects\TestProject\PizzaOlo\PizzaOlo\pizzas.json";
            string myJsonString = ReadJson(myPath); // get jason in a string to separate

            Dictionary<object, int> myToppings = GetToppings(myJsonString); // save toppings in a dictionary with the count

            const int cTop = 20;
            var myIESortToppings = (from entry in myToppings orderby entry.Value descending select entry).Take(3);
            List<KeyValuePair<object, int>> mySortToppings = (from entry in myToppings orderby entry.Value descending select entry).Take(cTop).ToList();

            int myRank = 0;
            foreach (var myTopping in mySortToppings)
            {
                myRank++;
                //string myToppingString = myTopping.Key.ToString().Split
                Console.WriteLine("Topping combination: {0}; rank: {1}; number of times ordered: {2}", myTopping.Key, myRank, myTopping.Value);
            }

            Console.ReadKey();
        }
        static string ReadJson(string pPath)
        {
            string myJsonString;

            using (StreamReader r = new StreamReader(pPath))
            {
                myJsonString = r.ReadToEnd();
            }

            return myJsonString;
        }

        static Dictionary<object, int> GetToppings(string pJsonString)
        {
            Dictionary<object, int> myToppings = new Dictionary<object, int>();

            var objects = JArray.Parse(pJsonString);
            foreach (var toppings in objects)
            {
                string myTopping = toppings.ToString();
                if (myToppings.ContainsKey(myTopping))
                {
                    myToppings[myTopping] += 1;
                }
                else
                {
                    myToppings.Add(myTopping, 1);
                }
            }

            return myToppings;
        }

        static Dictionary<object, int> GetToppings2(string pJsonString)
        {
            Dictionary<object, int> myToppings = new Dictionary<object, int>();

            var objects = JArray.Parse(pJsonString);
            foreach (var toppings in objects)
            {
                string myTopping = toppings.ToString();
                JToken myTest = toppings["toppings"].Value<JToken>();
                string myVal = myTest.ToString();
                if (myToppings.ContainsKey(myTopping))
                {
                    myToppings[myTopping] += 1;
                }
                else
                {
                    myToppings.Add(myTopping, 1);
                }
            }

            return myToppings;
        }
    }
}
