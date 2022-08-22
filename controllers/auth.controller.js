
export const authController = async(req , res) => {

    const { correo , password } = req.body;

    res.status(200).json({
        token: req.token
    })

}

