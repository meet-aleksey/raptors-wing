using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using ParrotWings.Api.DataContext;
using ParrotWings.Api.Models;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System;
using AutoMapper;

namespace ParrotWings.Api.Repositories
{
  public class UsersRepository : IDisposable
  {

    private ApplicationContext _context;

    private ApplicationUserManager _userManager;

    public UsersRepository()
    {
      _context = new ApplicationContext();

      _userManager = new ApplicationUserManager(new UserStore<ApplicationUser, ApplicationRole, int, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>(_context));
    }

    public async Task<IdentityResult> RegisterUserAsync(User userModel)
    {
      var user = new ApplicationUser
      {
        UserName = userModel.UserName,
        Email = userModel.Email       
      };

      // default points
      user.ParrotWings = 500; // TODO: config

      var result = await _userManager.CreateAsync(user, userModel.Password);

      return result;
    }

    public async Task<ApplicationUser> FindUserAsync(string email, string password)
    {
      var user = await _userManager.FindByEmailAsync(email);

      if (!_userManager.CheckPassword(user, password))
      {
        throw new Exception("The email or password is incorrect.");
      }

      return user;
    }

    public async Task<ApplicationUser> GetUserByEmailAsync(string email)
    {
      return await _userManager.FindByEmailAsync(email);
    }

    public async Task<List<ApplicationUser>> FindUsersAsync(string searchText)
    {
      var result = _context.Users.Where(u => u.Email.Contains(searchText) || u.UserName.Contains(searchText));

      return await result.ToListAsync();
    }

    /// <summary>
    /// Returns user by ID.
    /// </summary>
    public async Task<ApplicationUser> GetUserByIdAsync(int id)
    {
      return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    /// <summary>
    /// Returns users by IDs.
    /// </summary>
    public async Task<List<ApplicationUser>> GetUsersByIdAsync(params int[] ids)
    {
      if (ids == null || !ids.Any())
      {
        return null;
      }

      return await _context.Users.Where(u => ids.Contains(u.Id)).ToListAsync();
    }

    public async Task AddTransactionAsync(string senderEmail, int recipientId, decimal amount)
    {
      var sender = await GetUserByEmailAsync(senderEmail);
      var recipient = await GetUserByIdAsync(recipientId);

      await AddTransactionAsync(sender, recipient, amount);
    }

    public async Task AddTransactionAsync(int senderId, int recipientId, decimal amount)
    {
      var users = await GetUsersByIdAsync(senderId, recipientId);
      var sender = users.FirstOrDefault(u => u.Id == senderId);
      var recipient = users.FirstOrDefault(u => u.Id == recipientId);

      await AddTransactionAsync(sender, recipient, amount);
    }

    private async Task AddTransactionAsync(ApplicationUser sender, ApplicationUser recipient, decimal amount)
    {
      if (sender == null)
      {
        throw new Exception($"Sender not found.");
      }

      if (sender.ParrotWings < amount)
      {
        throw new Exception("Insufficient funds!");
      }

      if (recipient == null)
      {
        throw new Exception($"Recipient not found!");
      }

      // outgoing
      var outgoing = new Transaction();
      outgoing.UserId = sender.Id;
      outgoing.Amount = -amount;
      outgoing.SourceId = recipient.Id;
      outgoing.TransactionDate = DateTimeOffset.UtcNow;

      _context.Transactions.Add(outgoing);

      sender.ParrotWings -= amount;

      // incoming
      var incoming = new Transaction();
      incoming.UserId = recipient.Id;
      incoming.Amount = amount;
      incoming.SourceId = sender.Id;
      incoming.TransactionDate = DateTimeOffset.UtcNow;

      _context.Transactions.Add(incoming);

      recipient.ParrotWings += amount;

      await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Gets users transactions.
    /// </summary>
    /// <param name="email">Owner email.</param>
    /// <param name="offset">Offset.</param>
    /// <param name="limit">Limit. Default: 10.</param>
    public async Task<DataResult<Transaction>> GetTransactionsAsync(string email, int offset, int limit = 10)
    {
      var user = await GetUserByEmailAsync(email);

      if (user == null)
      {
        throw new Exception("User not found.");
      }

      var transactions = await (offset > 0 ?  _context.Transactions.Where(t => t.UserId == user.Id).Skip(offset).Take(limit) : _context.Transactions.Where(t => t.UserId == user.Id).Take(limit)).ToListAsync();
      int totalRecords = await _context.Transactions.CountAsync(t => t.UserId == user.Id);
      var usersIds = transactions.Select(t => t.SourceId).Distinct().ToArray();
      var users = await GetUsersByIdAsync(usersIds);
      var result = new DataResult<Transaction>
      {
        Users = Mapper.Map<List<ApplicationUser>, List<User>>(users),
        Data = transactions,
        TotalRecords = totalRecords
      };

      return result;
    }

    public void Dispose()
    {
      _context.Dispose();
      _userManager.Dispose();
    }

  }
}