import express from 'express';
import { createClients, deleteClient, getClients, updateClient } from '../controller/clientsController.js';

const router = express.Router();

/**
 * @swagger
 * /clients/:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 example: juan@example.com
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 */
router.post('/', createClients);

/**
 * @swagger
 * /clients/all:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/all', getClients);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Actualiza un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez Actualizado
 *               correo:
 *                 type: string
 *                 example: juan.actualizado@example.com
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 */
router.put('/:id', updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   patch:
 *     summary: Marca un cliente como eliminado
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente marcado como eliminado
 */
router.patch('/:id', deleteClient);

export default router;