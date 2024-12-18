#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
using namespace std;

// Some Helper Functions.

// To print the movies table in nice format.
void printTable(const vector<vector<string>> &table)
{
    for (const auto &row : table)
    {
        for (const auto &col : row)
        {
            cout << setw(24) << left << col;
        }
        cout << endl;
    }
}
// Helper function to convert time in "hh:mm" format to total minutes
int convertTimeToMinutes(const string &time)
{
    int hours, minutes;
    sscanf(time.c_str(), "%d:%d", &hours, &minutes);
    return hours * 60 + minutes;
}

// Helper function to convert duration in "xh xxm" format to total minutes
int convertDurationToMinutes(const string &duration)
{
    int hours = 0, minutes = 0;
    sscanf(duration.c_str(), "%dh %dm", &hours, &minutes);
    return hours * 60 + minutes;
}

class Movie
{
private:
    static int movieCount;

public:
    string duration;
    double price;
    string id, title, startTime;
    int bookingNumber = 0, capacity = 15;
    vector<pair<string, int>> userIdToNumTickets;
    Movie(string id, string title, string startTime, string duration, double price)
    {
        this->id = id;
        this->title = title;
        this->startTime = startTime;
        this->duration = duration;
        this->price = price;
        this->bookingNumber = 0;
    }

    void printDetails()
    {
        cout << "\n** Movie Details **\n\n";
        cout << "Title       :" << title << endl;
        cout << "Start Time  :" << startTime << endl;
        cout << "Duration    :" << duration << endl;
        cout << "Price       :" << price << endl;
    }
};

class Manager
{
private:
    string id = "manager123", password = "manager@123";
    int accountBalance = 0;

public:
    void viewAllMovies(vector<Movie> &movieList)
    {
        vector<vector<string>> table = {
            {" Title", "Start Time", "Duration", "Price"}};

        for (int i = 0; i < movieList.size(); i++)
        {
            table.push_back({"[" + to_string(i + 1) + "] " + movieList[i].title, movieList[i].startTime, movieList[i].duration, "Rs." + to_string(movieList[i].price)});
        }
        printTable(table);
        return;
    }
    void addMovie(vector<Movie> &movieList, Movie mov)
    {
        int newStartTime = convertTimeToMinutes(mov.startTime);
        int newDuration = convertDurationToMinutes(mov.duration);
        int newEndTime = newStartTime + newDuration;

        for (const Movie &existingMovie : movieList)
        {
            int existingStartTime = convertTimeToMinutes(existingMovie.startTime);
            int existingDuration = convertDurationToMinutes(existingMovie.duration);
            int existingEndTime = existingStartTime + existingDuration;

            // Check if there is an overlap
            if ((newStartTime < existingEndTime) && (existingStartTime < newEndTime))
            {
                cout << "Cannot add movie '" << mov.title << "' due to time clash with '" << existingMovie.title << "'.\n";
                return;
            }
        }
        movieList.push_back(mov);
        return;
    }
    void editMovieDetails(Movie &mov, int editCode, string value)
    {
        switch (editCode)
        {
        case 1:
            mov.title = value;
            break;
        case 2:
            mov.startTime = value;
            break;
        case 3:
            mov.duration = value;
            break;

        default:
            break;
        }
        return;
    }
    void editMoviePrice(Movie &mov, double newPrice)
    {
        mov.price = newPrice;
        return;
    }
    void deleteMovie(vector<Movie> &movieList, int movieId)
    {
        movieList.erase(movieList.begin() + movieId - 1);
        for (int i = 0; i < movieList.size(); i++)
        {
            movieList[i].id = to_string(i + 1);
        }
    }
};

class Customer
{

public:
    string id, password;
    double accountBalance;
    Customer(string id, string password, double accountBalance)
    {
        this->id = id;
        this->password = password;
        this->accountBalance = accountBalance;
    }
    void getAllMovies(vector<Movie> &movieList)
    {
        vector<vector<string>> table = {
            {" Title", "Start Time", "Duration", "Price"}};

        for (int i = 0; i < movieList.size(); i++)
        {
            table.push_back({"[" + to_string(i + 1) + "] " + movieList[i].title, movieList[i].startTime, movieList[i].duration, "Rs." + to_string(movieList[i].price)});
        }
        printTable(table);
        return;
    }
    void bookTicket(Movie &mov, int num, Customer &cust)
    {
        if (cust.accountBalance >= num * mov.price)
        {
            mov.userIdToNumTickets.emplace_back(cust.id, num);
            cout << mov.userIdToNumTickets.size();
            mov.bookingNumber += num;
            cust.accountBalance -= num * mov.price;

            cout << "\nTicket Booked Successfully!\n\n";

            cout << "** Ticket Details **\n\n";
            cout << "UserId : " << cust.id << endl;
            cout << "Qty : " << num << endl;
            cout << "Balance :" << cust.accountBalance << endl;
            mov.printDetails();
            cout << "\n Enjoy Your Movie !!\n";
        }
        else
        {
            cout << "\nYour Account Balance is Insufficient\n";
        }
    }
    void cancelTicket(Movie &mov, int num, Customer &cust)
    {
        int remain = 0;
        for (int i = 0; i < mov.userIdToNumTickets.size(); i++)
        {
            if (mov.userIdToNumTickets[i].first == cust.id)
            {
                if (num > mov.userIdToNumTickets[i].second)
                {
                    cout << "\nThe number of tickets you want to Cancel is more than you have booked.\n";
                    return;
                }
                else
                {
                    mov.userIdToNumTickets[i].second -= num;
                    remain = mov.userIdToNumTickets[i].second;
                    mov.bookingNumber -= num;
                    cust.accountBalance += num * mov.price;
                    cout << "\nTickets canceled successfully!\n";
                    cout << "\n** Ticket Details**\n";
                    cout << "\nUserId : " << cust.id << endl;
                    cout << "\nNumber of Tickets cancelled : " << num << endl;
                    cout << "\nNumber of Tickets Remaining : " << remain << endl;
                    cout << "\nAccount Balance : " << cust.accountBalance << endl;
                    return;
                }
            }
        }
        cout << "\nBookings for this movie not found from this account.\n";
        return;
    }
};

int main()
{
    vector<Movie> movieList = {Movie("1", "Lagaan", "10:00", "3h 44m", 600),
                               Movie("2", "3 Idiots", "6:00", "2h 50m", 500)};
    vector<Customer> users;
    while (true)
    {
        cout << "\n** Enter As **\n";
        cout << "\n[1] Customer\n[2] Manager\n";

        int code;
        cout << "\nEnter the code: ";
        cin >> code;
        Customer *curr = nullptr;
        if (code == 1)
        {
            cout << "\n[1] Register(If new User)\n[2] Login(if existing User)\n";
            cout << "\nSelect an option: ";

            int loginStatusCode;
            cin >> loginStatusCode;
            if (loginStatusCode == 1)
            {
                string id;
                bool idExists;
                do
                {
                    idExists = false;
                    cout << "\nEnter an ID : ";
                    cin >> id;

                    // Check if the ID already exists
                    for (const Customer &user : users)
                    {
                        if (user.id == id)
                        {
                            idExists = true; // ID already exists
                            cout << "\nID already exists. Please choose a different ID.\n";
                            break;
                        }
                    }
                } while (idExists);

                cout << "Enter password : ";
                string password;
                cin >> password;

                cout << "Enter Account Balance : ";
                double accountBalance;
                cin >> accountBalance;

                Customer *cus = new Customer(id, password, accountBalance);
                users.push_back(*cus);
                curr = &users.back();

                cout << "\nUser Registered successfully!";
            }
            else if (loginStatusCode == 2)
            {
                int success = 0;
                cout << "\nEnter an ID : ";
                string id;
                cin >> id;

                cout << "Enter password : ";
                string password;
                cin >> password;

                for (Customer &user : users)
                {
                    if (user.id == id && user.password == password)
                    {
                        curr = &user;
                        cout << "\nLogged in successfully!";
                        success = 1;
                        break;
                    }
                }
                if (!success)
                {
                    cout << "\nLogIn Failed!\n";
                    continue;
                }
            }

            cout << "\n\n[1] Book Tickets\n[2] Cancel Ticket\n[3] Return Home\n[4] Quit";
            cout << "\nSelect the option : ";
            int ticketOptionCode;
            cin >> ticketOptionCode;
            cout << endl;
            if (ticketOptionCode == 3)
            {
                continue;
            }
            else if (ticketOptionCode == 4)
            {
                return 0;
            }
            vector<vector<string>> table = {
                {" Title", "Start Time", "Duration", "Price"}};

            for (int i = 0; i < movieList.size(); i++)
            {
                table.push_back({"[" + to_string(i + 1) + "] " + movieList[i].title, movieList[i].startTime, movieList[i].duration, "Rs." + to_string(movieList[i].price)});
            }
            printTable(table);

            cout << "\n\nSelect a Movie : ";
            Movie selected("", "", "", "", 0);
            int selectedMovie;
            cin >> selectedMovie;
            for (int i = 0; i < movieList.size(); i++)
            {
                if (selectedMovie == i + 1)
                {
                    selected = movieList[i];
                    selected.printDetails();
                    break;
                }
            }
            if (ticketOptionCode == 1)
            {
                cout << "Enter the number of Tickets you want to Book : ";
                int num_tickets;
                cin >> num_tickets;

                cout << "\n\n** Price Details **\n";
                cout << "Amount per ticket : " << selected.price << endl;
                cout << "Total Amount      : " << num_tickets * selected.price << endl;

                cout << "[1] Proceed\n[2] Quit\n\n";
                cout << "\nSelect an Option : ";
                int proceedSelect;
                cin >> proceedSelect;

                if (proceedSelect == 1 && selected.bookingNumber + num_tickets <= selected.capacity)
                {
                    Movie &selected = movieList[selectedMovie - 1];
                    int amount;
                    cout << "\nEnter the amount for Payment : ";
                    cin >> amount;
                    if (amount != num_tickets * selected.price)
                    {
                        cout << "\nIncorrect amount.\n";
                    }
                    else
                    {
                        curr->bookTicket(selected, num_tickets, *curr);
                    }
                }
                else if (proceedSelect == 2)
                {
                    return 0;
                }
                else
                {
                    cout << "\nSeats are currently full.\n";
                }
            }
            else if (ticketOptionCode == 2)
            {
                Movie &selected = movieList[selectedMovie - 1];
                cout << "Enter the number of Tickets you want to Cancel : ";
                int num_tickets;
                cin >> num_tickets;
                curr->cancelTicket(selected, num_tickets, *curr);
            }
        }
        else if (code == 2)
        {
            cout << "Enter password : ";
            string password;
            cin >> password;
            Manager manager;
            if (password != "manager@123")
            {
                cout << "\nIncorrect Password\n";
                return 0;
            }

            cout << "\n\n[1] View All Movies List\n[2] Add a Movie\n[3] Edit a Movie\n[4] Delete a Movie";

            int operationSelected;
            cout << "\n\nSelect an Option : ";
            cin >> operationSelected;

            if (operationSelected == 1)
            {
                manager.viewAllMovies(movieList);
            }
            else if (operationSelected == 2)
            {
                string title, startTime, duration;

                string id = to_string(movieList.size() + 1);
                cout << "\nEnter Movie Title : ";
                cin.ignore();
                getline(cin, title);
                cout << "\nEnter the Start Time for movie(xx:xx format) : ";
                cin >> startTime;
                cout << "\nEnter the duration of movie (format - xh xxm): ";
                cin.ignore();
                getline(cin, duration);

                double Price;
                cout << "\nEnter the ticket Price : ";
                cin >> Price;

                Movie m(id, title, startTime, duration, Price);

                manager.addMovie(movieList, m);
            }
            else if (operationSelected == 3)
            {
                manager.viewAllMovies(movieList);
                cout << "\n\nSelect a Movie to Edit : ";
                int movieIdSelected;
                cin >> movieIdSelected;
                cout << "\n\n[1] Edit Title\n[2] Edit startTime\n[3] Edit Duration\n[4] Edit Price\n[5] Return Home\n[6] Quit";
                cout << "\n\nSelect edit option : ";
                int editOptCode;
                cin >> editOptCode;
                if (editOptCode < 4)
                {
                    string val;
                    switch (editOptCode)
                    {
                    case 1:
                        cout << "\nEnter Movie Title : ";
                        cin >> val;
                        break;
                    case 2:
                        cout << "\nEnter the Start Time for movie(xx:xx format) : ";
                        cin >> val;
                        break;
                    case 3:
                        cout << "\nEnter the duration of movie (format - xh xxm): ";
                        cin >> val;
                        break;
                    default:
                        break;
                    }
                    manager.editMovieDetails(movieList[movieIdSelected - 1], editOptCode, val);
                }
                else if (editOptCode == 4)
                {
                    double price;
                    cout << "\nEnter the ticket Price : ";
                    cin >> price;
                    manager.editMoviePrice(movieList[movieIdSelected - 1], price);
                }
                else if (editOptCode == 5)
                {
                    continue;
                }
                else if (editOptCode == 6)
                {
                    return 0;
                }
            }
            else if (operationSelected == 4)
            {
                manager.viewAllMovies(movieList);
                cout << "\n\nSelect a Movie to Edit : ";
                int movieId;
                cin >> movieId;
                manager.deleteMovie(movieList, movieId);
            }
            continue;
        }
    }
    return 0;
}