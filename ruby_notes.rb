# Ruby: Quick Reference
# ruby program.rb
# Style guide: https://github.com/bbatsov/ruby-style-guide

# Put string to output
puts "Hello World!"

# Declaring variable hello
hello = "Hello World!"
puts hello

# Defining hello method
def hello
  puts "Hello World!"
end

# Calls hello method
hello

# Sum method with arguments
def sum(a, b)
  a + b
end

puts sum(1, 2)

first_name = "Alfred"

# first_name.class => String
# first_name.methods => see all the methods

# Variables point to assignment of the variable (pass by value)
first_name_also = first_name

# first_name_also still has "Alfred" value
first_name = "Alfredo"
first_name.methods
first_name.length
first_name.reverse

# String interpolation
name = "Regine"
"My name is #{name}"

" ".nil?  # false
" ".empty?  # false

# Getting console input
puts "Hello enter in your first name"
input_name = gets.chomp

puts "Welcome #{input_name} to the club"

# Working with numbers
# Converting to float/int/string
puts 20/3.to_f
puts 12.0.to_i
puts 12.to_s

# Number methods
23.odd?
22.even?
rand(10); # between 0-9

# Repeats x number of times
20.times { puts "Outputs 20 times" }

# Conditional
if # condition
  # execute logic
elsif #condition
  # execute logic
else # condition
  # execute logic
end

# Arrays
arr = [1, 2, 3]
arr.empty?
arr.include?(1)
arr.reverse! # reverses it and mutates original array
arr.shuffle # shuffles it randomly and doesn't update original
(0..25).to_a # takes a range and converts it to an array
arr.push(30) # or arr << 30
arr.unshift(0) # adds to beginning of array
arr.pop # removes last element
arr.uniq # gets rid of duplicates

# Looping through array
# This prints out the value of each element i
arr.each { |i| puts i }

for number in arr
  puts "Outputs per each element"
end

names = ["alfred", "regine"]
names.each do |name|
  puts "Hello #{name.capitalize}"
end

# Joins all the elements with a space in between into one string
names.join(' ')

# Give it a boolean expression and if true it selects that element to add
# This gives back all the odd numbers in the array
arr.select  { |num| num.odd? }

# Hashes - key/value pairs (like dictionaries)
my_details = { 'name' => 'Alfred', 'gf' => 'Regine' }
my_details_name = my_details["name"]

# Using symbol as key
myhash = { a: 1, b: 2, c: 3 }
puts myhash[:c]
myhash[:d] = 7
myhash.delete(:b)

myhash.each { |k, v| puts "Key #{k} and Value #{v}" }
myhash.each { |k, v| myhash.delete(k) if v > 3 }
myhash.select { |k, v| v.odd? |}

# Sample Looping Question
loop do
  puts "Do you want to look up a city name? (Y/N)"

  answer = gets.chomp
  if answer != "Y"
    break
  end
end

# Object-oriented programming
# Encapsulation: blocking off areas of code and not making it available to the rest of program
# Abstraction: simplifying a complex process of a program, modeling classes
# Inheritance: class inherits behavior of another class called superclass
# Polymorphism: when class inherits behaviors of another class but has the ability to not inherit everything
# and change some of its inherited behaviors
# Classes: blueprint that describes state and behavior that objects of the class all share
class User 
  # Can include modules to have access to certain methods inside Destructable module
  include Destructable

  # Gives User class getter and setter for hobby
  attr_accessor :hobby

  def initialize(name, hobby)
    @name = name
    @hobby = hobby
  end

  def run
    puts "I am running! Woo cardio!"
  end

  def get_name
    @name
  end

  def set_name=(name)
    @name = name
  end

  # Defines a class name with self that doesn't need to be instantiated
  def self.identify_yourself
    puts "Hey I am a class method"
  end
end

user = User.new("Alfred", "Coding")
puts user
puts User.ancestors # User -> Object -> Kernel -> BasicObject, everything is an object in Ruby
user.run
user.get_name # need getters/setters to retrieve member variables
user.set_name = "Darkness"
user.hobby # Can access like this if attr_accessor set
user.hobby = "Drawing"
User.identify_yourself # runs class method without instantiating an object
user.destroy("Hello")

# Inheritance
class Buyer < User

end

buyer1 = Buyer.new("Regine", "Cardio")
buyer1.run

# Modules to include in classes
module Destructable
  def destroy(anyobject)
    puts "I will destroy the object"
  end
end


# Dealing with json
require 'json'

class User
  attr_accessor :email, :name, :permissions

  def initialize(*args)
    @email = args[0]
    @name = args[1]
    @permissions = User.permissions_from_template
  end

  def self.permissions_from_template
    file = File.read 'user_permissions_template.json'
    JSON.load(file, nil, symbolize_names: true)
  end

  def save
    self_json = { email: @email, name: @name, permissions: @permissions }.to_json
    open('users.json', 'a') do |file|
      file.puts self_json
    end
  end
end

require 'pp'
require_relative 'user'

user = User.new 'alfred@example.com', 'alfred'
pp user
user.save

# RSpec: testing tool for Ruby created for behavior-driven development with production apps
# TDD: write smallest possible test case that matches what we need to program
# - run the test and watch it fail, write some code to make it pass, run test suite, repeat
# until all tests pass, refactor to be as simple and clear as possible while keeping tests green
# BDD: write tests as specifications of system behavior
# Sample Rspec Usage:
describe Order do
  describe "#submit" do
    before do
      @book = Book.new(:title => "RSpec Intro", :price => 20)
      @customer = Customer.new
      @order = Order.new(@customer, @book)

      @order.submit
    end

    describe "customer" do
      it "puts the ordered book in customer's order history" do 
        expect(@customer.orders).to include(@order)
        expect(@customer.order_books).to include(@book)
      end
    end

    describe "order" do
      it "is marked as complete" do
        expect(@order).to be_complete
      end

      it "is not yet shipped" do
        expect(@order).not_to be_shipped
      end
    end
  end
end

# Setting up RSpec
# Gemfile, run bundle install --path .bundle
source "https://rubygems.org"
gem "rspec"

# Sample StringCalculator spec
# lib/string_calculator.rb
class StringCalculator
  def self.add(input)
    if input.empty?
      0
    else
      numbers = input.split(",").map { |num| num.to_i }
      numbers.inject(0) { |sum, number| sum + number }
    end
  end
end

# spec/string_calculator_spec.rb
require "string_calculator"

# Describe takes in an existing class or string to describe group of specs
describe StringCalculator do
  # class methods prefixed with a dot
  describe ".add" do
    # context block to describe the situation under which the add method is expected to return zero
    context "given an empty string" do
      # it block to describe a specific example test case
      it "returns zero" do
        expect(StringCalculator.add("")).to eql(0)
      end
    end

    context "given '4'" do
      it "returns 4" do
        expect(StringCalculator.add("4")).to eql(4)
      end
    end

    context "two numbers" do
      context "given '2,4'" do
        it "returns 6" do
          expect(StringCalculator.add("2,4")).to eql(6)
        end
      end
    end
  end
end

# bundle exec rspec --format documentation
