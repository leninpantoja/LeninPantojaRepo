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
            // create my PizzaToppings object and print results with the Top Most Popular Toppings
            PizzaToppings myPizzaToppings = new PizzaToppings(cJsonURL);
            myPizzaToppings.PrintResults(cTopMostPopularToppings);
            // myPizzaToppings.AllToppingsRankedResults; *** this can be used for other purposes; datatable/grid results ***

            // wait
            Console.ReadKey();
        }
    }
    
    public class PizzaToppings
    {
        private const string cMainJsonToken = "toppings";
        private const string cToppingsSeparator = ", ";
        public class CustomizedType
        {
            public int Rank { get; set; }
            public int TimesOrdered { get; set; }
            public string Toppings { get; set; }
        }
        public List<CustomizedType> AllToppingsRankedResults { get; } // accessible for other purposes

        public PizzaToppings(string pJsonURL)
        {
            // get json in a string to separate
            string myJsonString = GetJsonStringFromURL(pJsonURL);

            // get list of JToken and order the children list to be prepare for: "sausage, beef" and "beef, sausage" as one combination
            List<List<JToken>> myListOfToppingsOrdered = GetListOfToppingsOrdered(myJsonString);

            // get List of toppings in a simple string with specified separator
            List<string> myListOfToppings = myListOfToppingsOrdered.Select(x => string.Join(cToppingsSeparator, x)).ToList();

            // Prepare and populate the the customized list with the required logic (ranked)
            AllToppingsRankedResults = myListOfToppings.GroupBy(x => x).OrderByDescending(x => x.Count())
                                                       .Select((x, index) => new CustomizedType() { Rank = index + 1, TimesOrdered = x.Count(), Toppings = x.Key })
                                                       .ToList();
        }
        private string GetJsonStringFromURL(string pJsonURL)
        {
            string myJsonString;

            using (WebClient myWebClient = new WebClient())
            {
                try
                {
                    myJsonString = myWebClient.DownloadString(pJsonURL); // posible error; in case something wrong with Json URL
                }
                catch (Exception)
                {
                    myJsonString = string.Empty;
                }
            }

            return myJsonString;
        }
        private List<List<JToken>> GetListOfToppingsOrdered(string pJsonString)
        {
            JArray myJarray;
            try
            {
                myJarray = JArray.Parse(pJsonString); // posible error; in case something wrong with Json string 
            }
            catch (Exception)
            {
              myJarray = new JArray(); // just create to continue with the same logic until Results
            }

            // if there is NO token/data to find, so List is just created
            return myJarray.Values(cMainJsonToken).Select(x => x.OrderBy(o => o).ToList()).ToList();
        }
        public void PrintResults(int pTopMostPopularToppings)
        {
            if (AllToppingsRankedResults.Count == 0) // This means something wrong with Json URL or Json format
                Console.WriteLine("The provided Json URL was not found OR unexpected Json format.");
            else
                foreach (CustomizedType myItem in AllToppingsRankedResults.Take(pTopMostPopularToppings)) // ONLY the top rows required
                    Console.WriteLine("Rank: {0}; Number of times ordered: {1}; Topping combinations: {2}", myItem.Rank.ToString().PadRight(2), myItem.TimesOrdered.ToString().PadRight(4), myItem.Toppings);
        }
    }
}