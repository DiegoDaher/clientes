import Client from "../models/clientsModels.js";
import User from "../models/userModel.js"; 
import { sendConfirmationEmail } from "../services/rabbitServicesEvent.js";

export const createClients = async (req, res) => {
    const { names, email, phone, lastName, birthday, address } = req.body;

    // Validar que los campos obligatorios estén presentes
    if (!names || !email || !phone || !lastName || !birthday || !address) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'El correo no tiene un formato válido' });
    }

    // Validar que el teléfono tenga al menos 10 dígitos numéricos
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'El teléfono debe contener al menos 10 dígitos' });
    }

    try {
        // Verificar si el correo ya existe
        const existingClient = await Client.findOne({ where: { email } });
        if (existingClient) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Crear nuevo cliente
        const newClient = await Client.create({
            names,
            email,
            phone,
            lastName,
            birthday,
            address,
            status: true,
            creationDate: new Date(),
        });

        // Crear el usuario asociado con contraseña genérica
        const newUser = await User.create({
            username: email,
            phone,
            password: "a1b1c1d1", // Contraseña genérica
            status: true,
            creationDate: new Date(),
        });
        res.status(201).json({ message: 'Cliente y usuario creados correctamente', client: newClient, user: newUser });
        await sendConfirmationEmail(newClient);     
        console.log(newClient);
        res.status(201).json({ message: 'Cliente creado', data: newClient });
        // Enviar evento de creación de cliente a RabbitMQ
        await clientCreatedEvent(newClient);
    } catch (error) {
        console.error('Error al crear el cliente: ', error);
        res.status(500).json({ message: 'Error al crear el cliente' });
    }
};

export const getClients = async (req, res) => {
    try {
        const clients = await Client.findAll({
            where: { status: true }
        });
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error al listar clientes: ', error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};

export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { names, email, phone, lastName, birthday, address } = req.body;

    try {
        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Validar formato de correo electrónico si se actualiza
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'El correo no tiene un formato válido' });
            }

            // Verificar si el correo ya está registrado en otro cliente
            const existingClient = await Client.findOne({ where: { email } });
            if (existingClient && existingClient.id !== Number(id)) {
                return res.status(400).json({ message: 'El correo ya está registrado en otro cliente' });
            }
        }

        // Validar que el teléfono tenga al menos 10 dígitos numéricos
        if (phone) {
            const phoneRegex = /^\d{10,}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: 'El teléfono debe contener al menos 10 dígitos' });
            }
        }

        await client.update({
            names: names || client.names,
            email: email || client.email,
            phone: phone || client.phone,
            lastName: lastName || client.lastName,
            birthday: birthday || client.birthday,
            address: address || client.address,
        });

        return res.status(200).json({ message: 'Cliente actualizado', data: client });
    } catch (error) {
        console.error('Error al actualizar el cliente: ', error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

export const deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el cliente existe
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Verificar si el cliente ya está desactivado
        if (!client.status) {
            return res.status(400).json({ message: "El cliente ya está desactivado." });
        }

        // Cambiar el estado del cliente en lugar de eliminarlo
        await client.update({ status: false });

        return res.status(200).json({ message: 'Cliente deshabilitado correctamente', data: client });
    } catch (error) {
        console.error('Error al deshabilitar cliente: ', error);
        return res.status(500).json({ message: 'Error al deshabilitar cliente' });
    }
};