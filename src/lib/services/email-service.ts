import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  private getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    }
    return this.transporter
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
    try {
      const transporter = this.getTransporter()
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'SpeedLog <noreply@speedlog.com>',
        to,
        subject,
        html,
      })
      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }

  async sendPasswordReset(email: string, resetLink: string): Promise<boolean> {
    const html = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background-color: #fff; padding: 20px 0;">
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td align="center">
                  <img src="https://via.placeholder.com/150x50/007bff/ffffff?text=SpeedLog" alt="Logo" width="150" height="auto">
                </td>
              </tr>
              <tr>
                <td style="background-color: #fff; padding: 20px; font-size: 18px; line-height: 24px; color: #333;">
                  <p>Olá,</p>
                  <p>Recebemos uma solicitação para recuperar sua senha.</p>
                  <p>Para recuperar sua senha, por favor, clique no link abaixo:</p>
                  <p><a href="${resetLink}" style="color: #007bff; text-decoration: none;">Recuperar Senha</a></p>
                  <p>O link será válido por apenas 24 horas. Se você não solicitou a recuperação de senha, por favor, ignore este e-mail.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f6f6f6; padding: 20px; font-size: 14px; line-height: 18px; color: #333;">
                  <p>Atenciosamente,</p>
                  <p>Equipe de Suporte SpeedLog</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    return this.sendEmail({ to: email, subject: 'Recuperação de Senha - SpeedLog', html })
  }

  async sendCnhAprovada(email: string, nome: string): Promise<boolean> {
    const html = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background-color: #fff; padding: 20px 0;">
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td align="center">
                  <img src="https://via.placeholder.com/150x50/007bff/ffffff?text=SpeedLog" alt="Logo" width="150" height="auto">
                </td>
              </tr>
              <tr>
                <td style="background-color: #fff; padding: 20px; font-size: 18px; line-height: 24px; color: #333;">
                  <p>Olá ${nome},</p>
                  <p>Seu CNH foi aceito.</p>
                  <p>Após analisarmos os dados aceitamos seu CNH em nosso Sistema</p>
                  <p>Caso esteja logado no sistema limpe seu cookies e logue novamente.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f6f6f6; padding: 20px; font-size: 14px; line-height: 18px; color: #333;">
                  <p>Atenciosamente,</p>
                  <p>Equipe de Suporte SpeedLog</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    return this.sendEmail({ to: email, subject: 'CNH Aceito - SpeedLog', html })
  }

  async sendCnhNegada(email: string, nome: string): Promise<boolean> {
    const html = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background-color: #fff; padding: 20px 0;">
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td align="center">
                  <img src="https://via.placeholder.com/150x50/007bff/ffffff?text=SpeedLog" alt="Logo" width="150" height="auto">
                </td>
              </tr>
              <tr>
                <td style="background-color: #fff; padding: 20px; font-size: 18px; line-height: 24px; color: #333;">
                  <p>Olá ${nome},</p>
                  <p>Recebemos Seu CNH no Sistema.</p>
                  <p>E infelizmente seu CNH foi Negado</p>
                  <p>Caso queira contestar com novas informações entre em contato via este email.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f6f6f6; padding: 20px; font-size: 14px; line-height: 18px; color: #333;">
                  <p>Atenciosamente,</p>
                  <p>Equipe de Suporte SpeedLog</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    return this.sendEmail({ to: email, subject: 'CNH Negado - SpeedLog', html })
  }

  async sendCnhAprovadaRevisao(email: string, nome: string): Promise<boolean> {
    const html = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background-color: #fff; padding: 20px 0;">
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td align="center">
                  <img src="https://via.placeholder.com/150x50/007bff/ffffff?text=SpeedLog" alt="Logo" width="150" height="auto">
                </td>
              </tr>
              <tr>
                <td style="background-color: #fff; padding: 20px; font-size: 18px; line-height: 24px; color: #333;">
                  <p>Olá ${nome},</p>
                  <p>Seu CNH foi aceito após a análise.</p>
                  <p>Após analisarmos os novos dados informados aceitamos seu CNH em nosso Sistema</p>
                  <p>Caso esteja logado no sistema limpe seu cookies e logue novamente.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f6f6f6; padding: 20px; font-size: 14px; line-height: 18px; color: #333;">
                  <p>Atenciosamente,</p>
                  <p>Equipe de Suporte SpeedLog</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    return this.sendEmail({ to: email, subject: 'CNH Foi Aceito pós revisão - SpeedLog', html })
  }
}

export const emailService = new EmailService()