import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'src/utils/validation.zod';
import { useCreateUserMutation } from 'src/redux/services/usersApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Select, SelectItem } from '@nextui-org/react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Omit<User, '_id'>>({
    resolver: zodResolver(UserSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createUser, { isError }] = useCreateUserMutation();
  const router = useRouter();

  // Estados para controlar la visibilidad de campos sensibles
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSecretQuestionVisible, setIsSecretQuestionVisible] = useState(false);
  const [isSecretAnswerVisible, setIsSecretAnswerVisible] = useState(false);

  const onSubmit: SubmitHandler<Omit<User, '_id'>> = async (data) => {
    setIsLoading(true);
    try {
      await createUser(data).unwrap();
      router.push('/login');
    } catch (error) {
      toast.error('Error al registrar el usuario');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre de usuario */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Nombre
        </label>
        <div className="mt-2">
          <Input
            size="lg"
            id="username"
            placeholder="Ej. Fernando Rodriguez"
            {...register('username')}
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
            variant="bordered"
          />
        </div>
      </div>

      {/* Correo Electrónico */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Correo Electrónico
        </label>
        <div className="mt-2">
          <Input
            size="lg"
            id="email"
            placeholder="Anafer@example.com"
            {...register('email')}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            variant="bordered"
          />
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Contraseña
        </label>
        <div className="mt-2">
          <Input
            id="password"
            size="lg"
            placeholder="adakk125#1"
            {...register('password')}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={isPasswordVisible ? 'text' : 'password'}
            variant="bordered"
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
        </div>
      </div>

      {/* Rol usando NextUI Select */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Rol
        </label>
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => {
            const selectedKeys = new Set([value]);
            return (
              <Select
                aria-label="Rol"
                id='role'
                className='mt-2'
                size="lg"
                variant="bordered"
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                  // Convertir el Set a string (valor único)
                  const selectedValue = Array.from(keys)[0] || "";
                  onChange(selectedValue);
                }}
                placeholder="Seleccione un rol"
              >
                <SelectItem key="administrador" value="administrador">
                  Administrador
                </SelectItem>
                <SelectItem key="lider" value="lider">
                  Líder de equipo
                </SelectItem>
              </Select>
            );
          }}
        />
        {errors.role?.message && (
          <p className="text-red-500 pt-2 text-sm">{errors.role.message}</p>
        )}
      </div>

      {/* Pregunta Secreta */}
      <div>
        <label htmlFor="secret_question" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Pregunta Secreta
        </label>
        <div className="mt-2">
          <Input
            id="secret_question"
            size="lg"
            placeholder="¿Nombre de tu mascota?"
            {...register('secret_question')}
            endContent={
              <button
                aria-label="toggle secret question visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => setIsSecretQuestionVisible(!isSecretQuestionVisible)}
              >
                {isSecretQuestionVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={isSecretQuestionVisible ? 'text' : 'password'}
            variant="bordered"
            errorMessage={errors.secret_question?.message}
            isInvalid={!!errors.secret_question}
          />
        </div>
      </div>

      {/* Respuesta Secreta */}
      <div>
        <label htmlFor="secret_answer" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Respuesta Secreta
        </label>
        <div className="mt-2">
          <Input
            id="secret_answer"
            size="lg"
            placeholder="Neron"
            {...register('secret_answer')}
            endContent={
              <button
                aria-label="toggle secret answer visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => setIsSecretAnswerVisible(!isSecretAnswerVisible)}
              >
                {isSecretAnswerVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={isSecretAnswerVisible ? 'text' : 'password'}
            variant="bordered"
            errorMessage={errors.secret_answer?.message}
            isInvalid={!!errors.secret_answer}
          />
        </div>
      </div>

      {/* Botón de Registro */}
      <div>
        <Button
          size="lg"
          type="submit"
          isLoading={isLoading}
          fullWidth
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isLoading ? 'Procesando...' : 'Registrar'}
        </Button>
      </div>
      {isError && (
        <p className="text-red-500 pt-2 text-center">
          Ocurrió un error al tratar de registrar el usuario
        </p>
      )}
    </form>
  );
};
