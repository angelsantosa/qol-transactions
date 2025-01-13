import * as v from 'valibot';

export const DescriptionPromptParams = v.object({
  date: v.string(),
  amount: v.string(),
  category: v.string(),
  assetAccount: v.string(),
  expenseAccount: v.string(),
  description: v.string(),
});

export type DescriptionPromptParams = v.InferOutput<
  typeof DescriptionPromptParams
>;

export const transactionDescriptionPrompt = ({
  date,
  amount,
  category,
  assetAccount,
  expenseAccount,
  description,
}: DescriptionPromptParams) => `
      <Instructions>
          You are part of an application that keeps track of home financial transactions.
          Your job is to always generate descriptions for transactions in Spanish.
          Application inputs from user are made mostly in Spanish.
          You wil only return the desired description, nothing else.
          Description should be a short sentence (no more than 10 words) that summarizes the transaction.
      </Instructions>
      <Metadata of Transaction>
          Date: ${date}
          Amount: ${amount}
          Category: ${category}
          Asset Account: ${assetAccount}
          Expense Account: ${expenseAccount}
          Description made by user: ${description}
      </Metadata of Transaction>`;

export const transactionDescriptionEsPrompt = ({
  date,
  amount,
  category,
  assetAccount,
  expenseAccount,
  description,
}: DescriptionPromptParams) => `
<Instrucciones>
    Eres parte de una aplicación que registra gastos y transacciones financieras (ingresos y egresos) de una casa.
    Solo debes devolver la descripción deseada, nada más.
    La descripción debe ser una frase corta (no más de 10 palabras) que resuma la transacción.
    Debes ser conciso y no usar palabras que no sean necesarias.
    Debes de llevar un patron, estas descripciones seran visibles en un dashboard de gastos y transacciones.
    De no tener suficiente información, debes devolver una descripción genérica basada en la subcategoria de gasto.
</Instrucciones>

<Datos de la Transacción>
    Fecha: ${date}
    Monto: ${amount}
    Categoría de compra: ${category}
    Cuenta de retiro: ${assetAccount}
    Cuenta/Lugar/Subcategoria donde se gastó: ${expenseAccount}
    Descripción hecha por el usuario: ${description}
</Datos de la Transacción>
    `;
