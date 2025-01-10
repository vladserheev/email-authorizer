# Command Authorization via Email

This project implements a system where terminal commands are authorized via email. Commands are entered through a web-based user interface and will not be executed until approved by an administrator through email.

## Features

- Secure email-based approval workflow for terminal commands.
- Configurable via a JSON file.
- Simple setup with minimal dependencies.

## Prerequisites

- Node.js (v14 or later)
- NPM
- Access to an SMTP email server for sending authorization emails

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the application:**

   Edit the `config.json` file to include your email server details and administrator email address:

   ```json
   {
       "smtpHost": "smtp.example.com",
       "smtpPort": 587,
       "smtpUser": "your_email@example.com",
       "smtpPass": "your_password",
       "adminEmail": "admin_email@example.com"
   }
   ```

## Usage

1. **Start the application:**

   ```bash
   node app
   ```

2. **Access the web interface:**

   Open your web browser and navigate to `http://localhost:[PORT]`. Enter your terminal command in the provided input field.

3. **Authorization email:**

   The entered command will be sent to the administrator's email for approval. The administrator will receive a unique approval link.

4. **Execution:**

   Once the administrator approves the command via the email link, it will execute, and the output will be displayed on the web interface.

## Configuration

The `config.json` file contains the following keys:

- `smtpHost`: SMTP server hostname (e.g., `smtp.example.com`)
- `smtpPort`: SMTP server port (default: `587` for TLS)
- `smtpUser`: Email account username
- `smtpPass`: Email account password
- `adminEmail`: Administrator email address to receive authorization requests

## Security

- Ensure that sensitive credentials (e.g., `smtpPass`) are stored securely and not hardcoded in the code.
- Use environment variables or a secret management tool to store sensitive information.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
