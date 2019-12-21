using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using System.Net;

namespace PizzaOlo
{
    class Program
    {
        private const string cJsonURL = "http://files.olo.com/pizzas.json";
        private const int cTopMostPopularToppings = 20;

        static void Main(string[] args)
        {
            // create my PizzaToppings object
            PizzaToppings myPizzaToppings = new PizzaToppings(cJsonURL);
            // print results with the Top Most Popular Toppings
            myPizzaToppings.PrintResults(cTopMostPopularToppings);
            // wait
            Console.ReadKey();
        }
    }

    public class PizzaToppings
    {
        private const string cMainJsonToken = "toppings";
        private const string cToppingsSeparator = ", ";
        private string _JsonURL;
        private Dictionary<string, int> _DictionaryOfToppings;

        public PizzaToppings(string pJsonURL)
        {
            // get json in a string to separate
            _JsonURL = pJsonURL;
            string myJsonString = GetJsonStringFromURL(pJsonURL);
            // get List of toppings
            List<string> myListOfToppings = GetListOfToppings(myJsonString); // if something wrong with Json string just new list
            // get Dictionary with the Key combination of topping and the number of order
            _DictionaryOfToppings = GetDictionaryOfToppings(myListOfToppings);
        }
        private string GetJsonStringFromURL(string pJsonURL)
        {
            string myJsonString;

            using (WebClient myWebClient = new WebClient())
            {
                try
                {
                    myJsonString = myWebClient.DownloadString(pJsonURL);
                }
                catch (Exception)
                {
                    myJsonString = string.Empty;
                }
            }

            return myJsonString;
        }
        private List<string> GetListOfToppings(string pJsonString)
        {
            List<string> myListOfToppings = new List<string>();

            JArray myJarray;
            try
            {
              myJarray = JArray.Parse(pJsonString); // in case something wrong with Json string 
            }
            catch (Exception)
            {
              myJarray = new JArray(); // just create to continue with the same logic until Results
            }

            var myIEToppings = myJarray.Value<JArray>().Values<JToken>(cMainJsonToken); // if there is NO token/data to find, so List is just created
            List<JToken> myObjListOfToppings = myIEToppings.ToList<JToken>();
            foreach (JToken myObjTopping in myObjListOfToppings)
            {
              // convert Toppings to simple string with Separator
              string myStringToppings = string.Join(cToppingsSeparator, myObjTopping.ToList<object>());
              myListOfToppings.Add(myStringToppings);
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
                    myDictionaryOfToppings[myTopping]++;
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
            if (mySortToppings.Count == 0) // Count = 0, this means something wrong with Json URL or Json format
            {
                Console.WriteLine("Json URL was not found OR unexpected Json format : {0}", _JsonURL);
            }
            else
            {
                int myRank = 1;
                foreach (KeyValuePair<string, int> myTopping in mySortToppings)
                {
                  Console.WriteLine("Rank: {0}; Number of times ordered: {1}; Topping combinations: {2}", (myRank++).ToString().PadRight(2), myTopping.Value.ToString().PadRight(4), myTopping.Key);
                }
            }
        }
    }
}