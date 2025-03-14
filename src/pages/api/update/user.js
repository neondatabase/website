import prisma from 'utils/prisma';

export default async function handle(req, res) {
  if (req.query?.id && req.query?.colorSchema) {
    try {
      const updateUser = await prisma.user.update({
        where: { id: +req.query.id },
        data: {
          colorSchema: req.query.colorSchema,
        },
      });

      res.status(200).json(updateUser);
    } catch (e) {
      res.status(403).json({ err: 'Error occurred while updating user data' });
    }
  } else {
    res.status(404).json({ err: 'Not found user id or color schema' });
  }
}
