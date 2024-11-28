import { SectionTitle } from "src/components/Common/SectionTitle";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanySchema } from "src/utils/validation.zod";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton for loading state
import { useUpdateCompanyMutation } from "src/redux/services/company.Api";

type QuickUpdateCompanyProps = {
  company: Company;
  isErrorCompany: boolean;
  isLoadingCompany: boolean;
};

export const QuickUpdateCompany = ({
  company,
  isErrorCompany,
  isLoadingCompany,
}: QuickUpdateCompanyProps) => {
  const [updateCompany] = useUpdateCompanyMutation();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Company>({
    resolver: zodResolver(CompanySchema),
    defaultValues: company,
  });

  const onSubmit: SubmitHandler<Company> = async (data) => {
    try {
      await updateCompany(data).unwrap();
      toast.success("Actualizado Exitosamente!");
    } catch (error) {
      toast.error("Error al actualizar la Empresa");
    }
  };

  // Actualizar los valores del formulario cuando cambie `company`
  useEffect(() => {
    if (company) {
      reset(company);
    }
  }, [company, reset]);

  return (
    <div className="bg-black-nav rounded-xl p-4 mt-4">
      <SectionTitle>Actualizar Empresa</SectionTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg pt-2 mx-auto bg-black-nav rounded-md"
      >
        {/* Estado de Carga */}
        {isLoadingCompany ? (
          <div>
            {/* Skeletons for each TextField */}
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
          </div>  
        ) : (
          <>
            {/* Campo RIF */}
            <div className="mb-4">
              <ThemeProvider theme={TextFieldTheme}>
                <Controller
                  name="id_card"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="RIF"
                      variant="outlined"
                      fullWidth
                      {...field}
                      error={!!errors.id_card}
                      helperText={errors.id_card?.message}
                      disabled={isLoadingCompany} // Disable field while loading
                    />
                  )}
                />
              </ThemeProvider>
            </div>

            {/* Campo Nombre */}
            <div className="mb-4">
              <ThemeProvider theme={TextFieldTheme}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Nombre"
                      variant="outlined"
                      fullWidth
                      {...field}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={isLoadingCompany} // Disable field while loading
                    />
                  )}
                />
              </ThemeProvider>
            </div>

            {/* Campo Correo Electrónico */}
            <div className="mb-4">
              <ThemeProvider theme={TextFieldTheme}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Correo Electrónico"
                      variant="outlined"
                      fullWidth
                      {...field}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isLoadingCompany} // Disable field while loading
                    />
                  )}
                />
              </ThemeProvider>
            </div>

            {/* Campo Teléfono */}
            <div className="mb-4">
              <ThemeProvider theme={TextFieldTheme}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Teléfono"
                      variant="outlined"
                      fullWidth
                      {...field}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      disabled={isLoadingCompany} 
                    />
                  )}
                />
              </ThemeProvider>
            </div>

            {/* Campo Dirección */}
            <div className="mb-4">
              <ThemeProvider theme={TextFieldTheme}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Dirección"
                      variant="outlined"
                      fullWidth
                      {...field}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      disabled={isLoadingCompany} 
                    />
                  )}
                />
              </ThemeProvider>
            </div>

            {/* Botón de Enviar */}
            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                className={`bg-orange-600 text-white px-4 py-2 w-full rounded-full transition ease-in-out delay-150 hover:scale-90 hover:bg-orange-700 duration-300 
                ${isLoadingCompany ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isLoadingCompany} 
              >
                {isLoadingCompany ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  "Modificar Empresa"
                )}
              </button>
            </div>
          </>
        )}

        {/* Mensajes de error */}      
        {isErrorCompany && (
          toast.error('Hubo un error al cargar la Empresa')
        )}
      </form>
    </div>
  );
};
