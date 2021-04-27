import React from "react";
import { TextField, Button } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import InputMask from "react-input-mask";

function UserData({ onSubmit, data, signup }) {
    const validationSchema = yup.object({
        email: yup
            .string("Enter your email")
            .email("Enter a valid email")
            .required("Email is required"),
        password: yup
            .string("Enter your password")
            .min(8, "Password should be of minimum 8 characters length")
            .required("Password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match"),
        cpf: yup.string().required(),
        phone: yup.string().required(),
    });

    const formik = useFormik({
        initialValues: {
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            phone: data.phone,
            cpf: data.cpf,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSubmit({
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                cpf: values.cpf,
            });
        },
    });

    return (
        <>
            {signup ? <h2 className="form-title">Crie sua conta</h2> : ""}
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    id="name"
                    label="Nome"
                    type="text"
                    variant="filled"
                    margin="normal"
                    fullWidth
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    id="email"
                    label="Email"
                    type="email"
                    variant="filled"
                    margin="normal"
                    fullWidth
                    required
                />
                <div className="input-container-form">
                    <div className="margin-form">
                        <TextField
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.password &&
                                Boolean(formik.errors.password)
                            }
                            helperText={
                                formik.touched.password &&
                                formik.errors.password
                            }
                            id="password"
                            name="password"
                            label="Senha"
                            type="password"
                            autoComplete="new-password"
                            variant="filled"
                            margin="normal"
                            required={signup}
                            className="inline-input"
                        />
                    </div>
                    <TextField
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                        }
                        helperText={
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                        }
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="new-password"
                        label="Confirma Senha"
                        type="password"
                        variant="filled"
                        margin="normal"
                        required={signup}
                        className="inline-input"
                    />
                </div>
                <div className="input-container-form">
                    <div className="margin-form">
                        <InputMask
                            mask="999.999.999-99"
                            maskChar=" "
                            value={formik.values.cpf}
                            onChange={formik.handleChange}
                        >
                            {(inputProps) => (
                                <TextField
                                    {...inputProps}
                                    error={
                                        formik.touched.cpf &&
                                        Boolean(formik.errors.cpf)
                                    }
                                    helperText={
                                        formik.touched.cpf && formik.errors.cpf
                                    }
                                    id="cpf"
                                    name="cpf"
                                    label="CPF"
                                    type="tel"
                                    variant="filled"
                                    margin="normal"
                                    required
                                    className="inline-input"
                                />
                            )}
                        </InputMask>
                    </div>
                    <InputMask
                        mask="(99) 99999-9999"
                        maskChar=" "
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                error={
                                    formik.touched.phone &&
                                    Boolean(formik.errors.phone)
                                }
                                helperText={
                                    formik.touched.phone && formik.errors.phone
                                }
                                id="phone"
                                name="phone"
                                label="Telefone"
                                type="tel"
                                variant="filled"
                                margin="normal"
                                required
                                className="inline-input"
                            />
                        )}
                    </InputMask>
                </div>
                <div
                    className={
                        signup
                            ? "navigation-container"
                            : "navigation-container edit-button"
                    }
                >
                    {signup ? (
                        <>
                            <Button disabled>Voltar</Button>
                            <Button type="submit" color="primary">
                                Próximo
                            </Button>
                        </>
                    ) : (
                        <Button type="submit" color="primary">
                            Salvar alterações
                        </Button>
                    )}
                </div>
            </form>
        </>
    );
}

export default UserData;
