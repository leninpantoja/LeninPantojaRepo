using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Newtonsoft.Json.Linq;

namespace PizzaOlo
{
    class Program
    {
        private const string cJsonFileName = @"..\..\pizzas.json";
        private const int cTopMostPopularToppings = 20;

        static void Main(string[] args)
        {
            // create my PizzaToppings object
            PizzaToppings myPizzaToppings = new PizzaToppings(cJsonFileName);
            // print results with the Top Most Popular Toppings
            myPizzaToppings.PrintResults(cTopMostPopularToppings);
            // wait
            Console.ReadKey();
        }
    }

    public class PizzaToppings
    {
        private Dictionary<string, int> _DictionaryOfToppings;

        public PizzaToppings(string pJsonFileName)
        {
            // get json in a string to separate
            string myJsonString = ReadJson(pJsonFileName);
            // get List of toppings
            List<string> myListOfToppings = GetListOfToppings(myJsonString);
            // get Dictionary with the Key combination of topping and the number of order
            _DictionaryOfToppings = GetDictionaryOfToppings(myListOfToppings);
        }
        private string ReadJson(string pJsonFileName)
        {
            string myJsonString;

            using (StreamReader r = new StreamReader(pJsonFileName))
            {
                myJsonString = r.ReadToEnd();
            }

            return myJsonString;
        }
        private List<string> GetListOfToppings(string pJsonString)
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
        private Dictionary<string, int> GetDictionaryOfToppings(List<string> pListOfToppings)
        {
            Dictionary<string, int> myDictionaryOfToppings = new Dictionary<string, int>();

            foreach (string myTopping in pListOfToppings)
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
        public void PrintResults(int pTopMostPopularToppings)
        {
            // order by Value desc ONLY the top rows required
            List<KeyValuePair<string, int>> mySortToppings = (from entry in _DictionaryOfToppings orderby entry.Value descending select entry).Take(pTopMostPopularToppings).ToList();
            // print Results
            int myRank = 1;
            foreach (KeyValuePair<string, int> myTopping in mySortToppings)
            {
                Console.WriteLine("Topping combination: {0}; Rank: {1}; Number of times ordered: {2}", myTopping.Key, myRank++, myTopping.Value);
            }
        }
    }
}