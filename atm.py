import sys
import os

# 1. Database MUST be outside or passed into the function
users = {
    "Nitik": {"pin": "1234", "balance": 5000.0},
    "Amity": {"pin": "0000", "balance": 100.0}
}

def run_atm():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("==============================")
    print("    WELCOME TO THE PYTHON ATM ")
    print("==============================")
    
    username = input("Enter Username: ")
    
    if username not in users:
        print("❌ Error: User not found.")
        return

    attempts = 3
    authenticated = False
    
    while attempts > 0:
        entered_pin = input(f"Enter PIN for {username} ({attempts} attempts left): ")
        if entered_pin == users[username]["pin"]:
            authenticated = True
            break
        else:
            attempts -= 1
            print("❌ Incorrect PIN.")

    if not authenticated:
        print("\n⛔ Locked out.")
        sys.exit()

    # CRITICAL: Everything inside this loop MUST be indented 4 spaces
    while True:
        print("\n1.💰Balance | 2. Deposit | 3. Withdraw | 4. Exit")
        choice = input("Select (1-4): ")

        if choice == "1":
            print(f" Balance: ${users[username]['balance']:.2f}")

        elif choice == "2":
            try:
                amount = float(input("Enter deposit: $"))
                if amount > 0:
                    users[username]["balance"] += amount
                    print("✅ Deposited.")
            except ValueError:
                print("❌ Enter numbers only.")

        elif choice == "3":
            try:
                amount = float(input("Enter withdrawal: $"))
                if 0 < amount <= users[username]["balance"]:
                    users[username]["balance"] -= amount
                    print("✅ Withdrawn.")
                else:
                    print("❌ Insufficient funds or invalid amount.")
            except ValueError:
                print("❌ Enter numbers only.")

        elif choice == "4":
            print("Goodbye!")
            break

if __name__ == "__main__":
    run_atm()