using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Newtonsoft.Json.Linq;

namespace PizzaOlo
{
    class Program
    {
        static void Main(string[] args)
        {
            // get json in a string to separate
            const string myPath = @"..\..\pizzas.json";
            string myJsonString = ReadJson(myPath);
            // get List of toppings
            List<string> myListOfToppings = GetListOfToppings(myJsonString);
            // get Dictionary with the Key combination of topping and the number of order
            Dictionary<string, int> myDictionaryOfToppings = GetDictionaryOfToppings(myListOfToppings);
            // order by Value desc ONLY the 20 rows
            const int cTop = 20;
            List<KeyValuePair<string, int>> mySortToppings = (from entry in myDictionaryOfToppings orderby entry.Value descending select entry).Take(cTop).ToList();
            // print Results
            int myRank = 1;
            foreach (var myTopping in mySortToppings)
            {
                Console.WriteLine("Topping combination: {0}; Rank: {1}; Number of times ordered: {2}", myTopping.Key, myRank++, myTopping.Value);
            }
            // wait
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

        static List<string> GetListOfToppings(string pJsonString)
        {
            List<string> myListOfToppings = new List<string>();

            var myObjects = JArray.Parse(pJsonString);
            foreach (var myTopping in myObjects)
            {
                JToken myToken = myTopping["toppings"].Value<JToken>();
                string myStringTopping = string.Join(",", myToken.ToList<object>());
                myListOfToppings.Add(myStringTopping);
            }

            return myListOfToppings;
        }
        static Dictionary<string, int> GetDictionaryOfToppings(List<string> myListOfToppings)
        {
            Dictionary<string, int> myDictionaryOfToppings = new Dictionary<string, int>();

            foreach (string myTopping in myListOfToppings)
            {
                if (myDictionaryOfToppings.ContainsKey(myTopping))
                {
                    myDictionaryOfToppings[myTopping] += 1;
                }
                else
                {
                    myDictionaryOfToppings.Add(myTopping, 1);
                }
            }

            return myDictionaryOfToppings;
        }
    }
}
