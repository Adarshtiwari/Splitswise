// Email constants
const EMAIL_SUBJECTS = {
    TOURNAMENT_REGISTRATION: 'Registration Confirmation for Tournament',
    PASSWORD_RESET: 'Password Reset Request'
};

const EMAIL_BODIES = {
    TOURNAMENT_REGISTRATION: (userName) => `
        Dear ${userName},
        
        Thank you for registering for the  tournament. 
        We look forward to seeing you in the competition.
        
        Regards,
        Your Tournament Team
    `,
    PASSWORD_RESET: (userName, resetLink) => `
        Dear ${userName},
        
        You have requested to reset your password. Please click on the link below to reset your password:
        ${resetLink}
        
        If you did not request this, please ignore this email.
        
        Regards,
        Your App Team
    `
};

module.exports = {
    EMAIL_SUBJECTS,
    EMAIL_BODIES
};
