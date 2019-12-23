Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports Newtonsoft.Json.Linq
Imports System.Net

Module Module1
  Private Const cJsonURL As String = "http://files.olo.com/pizzas.json"
  Private Const cTopMostPopularToppings As Integer = 20

  Sub Main()
    ' create my PizzaToppings object And print results with the Top Most Popular Toppings
    Dim myPizzaToppings As New PizzaToppings(cJsonURL)
    myPizzaToppings.PrintResults(cTopMostPopularToppings)
    ' myPizzaToppings.AllToppingsRankedResults *** this can be used for other purposes; datatable/grid results ***

    ' wait
    Console.ReadKey()
  End Sub
End Module

Public Class PizzaToppings
  Private Const cMainJsonToken As String = "toppings"
  Private Const cToppingsSeparator As String = ", "
  Public Class CustomizedType
    Public Property Rank As Integer
    Public Property TimesOrdered As Integer
    Public Property Toppings As String
  End Class
  Public ReadOnly Property AllToppingsRankedResults As List(Of CustomizedType)

  Public Sub New(ByVal pJsonURL As String)
    ' get json in a string to separate
    Dim myJsonString As String = GetJsonStringFromURL(pJsonURL)

    ' get list of JToken And order the children list to be prepare for "sausage, beef" And "beef, sausage" as one combination
    Dim myListOfToppingsOrdered As List(Of List(Of JToken)) = GetListOfToppingsOrdered(myJsonString)

    ' get List of toppings in a simple string with specified separator
    Dim myListOfToppings As List(Of String) = myListOfToppingsOrdered.Select(Function(x) String.Join(cToppingsSeparator, x)).ToList

    ' Prepare And populate the the customized list with the required logic (ranked)
    AllToppingsRankedResults = myListOfToppings.GroupBy(Function(x) x).OrderByDescending(Function(x) x.Count) _
                                .Select(Function(x, index) New CustomizedType With {.Rank = index + 1, .TimesOrdered = x.Count, .Toppings = x.Key}) _
                                .ToList
  End Sub
  Private Function GetListOfToppingsOrdered(ByVal pJsonString As String) As List(Of List(Of JToken))
    Dim myJarray As JArray
    Try
      myJarray = JArray.Parse(pJsonString)
    Catch ex As Exception
      myJarray = New JArray
    End Try

    ' if there Is NO token/data to find, so List Is just created
    Return myJarray.Values(cMainJsonToken).Select(Function(x) x.OrderBy(Function(o) o).ToList).ToList
  End Function

  Private Function GetJsonStringFromURL(ByVal pJsonURL As String) As String
    Dim myJsonString As String

    Using myWebClient As New WebClient()
      Try
        myJsonString = myWebClient.DownloadString(pJsonURL) ' posible Error; In Case something wrong With Json URL
      Catch ex As Exception
        myJsonString = String.Empty
      End Try
    End Using

    Return myJsonString
  End Function
  Public Sub PrintResults(ByVal pTopMostPopularToppings As Integer)
    If AllToppingsRankedResults.Count = 0 Then ' This means something wrong With Json URL Or Json format
      Console.WriteLine("The provided Json URL was not found OR unexpected Json format.")
    Else
      For Each myItem As CustomizedType In AllToppingsRankedResults.Take(pTopMostPopularToppings) ' ONLY the top rows required
        Console.WriteLine("Rank: {0}; Number of times ordered: {1}; Topping combinations: {2}", myItem.Rank.ToString.PadRight(2), myItem.TimesOrdered.ToString.PadRight(4), myItem.Toppings)
      Next
    End If
  End Sub
End Class