import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBIT_HOST;
const RABBIT_EXCHANGE = "user_event";
const RABBIT_ROUTING_KEY = "client.created";

export const sendConfirmationEmail = async (email, password) => {
    const mailOptions = {
      from: 'di3goddc05@gmail.com',
      to: email,
      subject: 'Confirmación de Registro',
      html: `
        <h1>¡Bienvenido!</h1>
        <p>Tu cuenta ha sido creada exitosamente.</p>
        <p><strong>Usuario:</strong> ${email}</p>
        <p><strong>Contraseña:</strong> ${password}</p>
        <p>Por favor, inicia sesión y cambia tu contraseña lo antes posible.</p>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${email}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
}
  };